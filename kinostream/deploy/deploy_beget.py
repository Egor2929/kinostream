#!/usr/bin/env python3
"""One-shot Beget deploy script. Run locally, not committed with secrets."""

from __future__ import annotations

import os
import sys
import textwrap
import time

import paramiko

HOST = os.environ.get("BEGET_HOST", "martyntm.beget.tech")
USER = os.environ.get("BEGET_USER", "martyntm")
PASSWORD = os.environ.get("BEGET_PASSWORD", "")
PORT = int(os.environ.get("BEGET_SSH_PORT", "22"))
DOCKER_PORT = 222

HOME = "/home/m/martyntm"
SITE_DIR = f"{HOME}/kinoregin.ru"
REPO_DIR = f"{SITE_DIR}/repo"
APP_DIR = f"{REPO_DIR}/kinostream"
REPO_URL = "https://github.com/Egor2929/kinostream.git"

TMDB_KEY = os.environ.get("TMDB_API_KEY", "")
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://kinoregin.ru")
AD_DURATION = os.environ.get("NEXT_PUBLIC_AD_DURATION", "15")

NODE_VERSION = "v20.18.3"
NODE_TAR = f"node-{NODE_VERSION}-linux-x64.tar.xz"
NODE_URL = f"https://nodejs.org/dist/{NODE_VERSION}/{NODE_TAR}"


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 600) -> tuple[int, str, str]:
    print(f"\n$ {cmd}")
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    if out.strip():
        print(out.rstrip())
    if err.strip():
        print(err.rstrip(), file=sys.stderr)
    if exit_code != 0:
        raise RuntimeError(f"Command failed ({exit_code}): {cmd}")
    return exit_code, out, err


def connect_docker(outer: paramiko.SSHClient) -> paramiko.SSHClient:
    transport = outer.get_transport()
    if transport is None:
        raise RuntimeError("No transport")
    channel = transport.open_channel("direct-tcpip", ("localhost", DOCKER_PORT), ("127.0.0.1", 0))
    inner = paramiko.SSHClient()
    inner.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    inner.connect(
        "localhost",
        username=USER,
        password=PASSWORD,
        sock=channel,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )
    return inner


def main() -> None:
    if not PASSWORD:
        print("Set BEGET_PASSWORD env var", file=sys.stderr)
        sys.exit(1)
    if not TMDB_KEY:
        print("Set TMDB_API_KEY env var", file=sys.stderr)
        sys.exit(1)

    outer = paramiko.SSHClient()
    outer.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {USER}@{HOST}...")
    outer.connect(
        HOST,
        port=PORT,
        username=USER,
        password=PASSWORD,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    print("Connecting to Docker...")
    docker = connect_docker(outer)

    node_path = f"{HOME}/.local/bin/node"
    _, out, _ = run(docker, f"test -x {node_path} && {node_path} -v || echo MISSING")
    if "MISSING" in out:
        print("Installing Node.js into ~/.local ...")
        run(
            docker,
            textwrap.dedent(
                f"""
                set -e
                mkdir -p {HOME}/.local
                cd {HOME}/.local
                wget -q {NODE_URL} -O {NODE_TAR}
                tar xf {NODE_TAR} --strip-components=1
                rm -f {NODE_TAR}
                {node_path} -v
                npm -v
                """
            ).strip(),
            timeout=900,
        )
    else:
        print(f"Node already installed: {out.strip()}")

    run(docker, f"mkdir -p {REPO_DIR}")
    _, out, _ = run(docker, f"test -d {REPO_DIR}/.git && echo yes || echo no")
    if "yes" in out:
        run(
            docker,
            f"cd {REPO_DIR} && git fetch origin main && git reset --hard origin/main",
            timeout=300,
        )
    else:
        run(docker, f"git clone {REPO_URL} {REPO_DIR}", timeout=300)

    env_content = (
        f"TMDB_API_KEY={TMDB_KEY}\n"
        f"NEXT_PUBLIC_SITE_URL={SITE_URL}\n"
        f"NEXT_PUBLIC_AD_DURATION={AD_DURATION}\n"
        "NODE_ENV=production\n"
    )
    run(
        docker,
        f"cat > {APP_DIR}/.env.production <<'EOF'\n{env_content}EOF",
    )

    run(
        docker,
        f"export PATH={HOME}/.local/bin:$PATH && cd {APP_DIR} && npm ci && npm run build",
        timeout=1800,
    )

    htaccess = textwrap.dedent(
        f"""
        PassengerNodejs {node_path}
        PassengerAppRoot {APP_DIR}
        PassengerAppType node
        PassengerStartupFile server.js
        PassengerFriendlyErrorPages off
        """
    ).strip()
    run(
        docker,
        f"cat > {SITE_DIR}/.htaccess <<'EOF'\n{htaccess}\nEOF",
    )

    run(
        docker,
        f"""
        set -e
        cd {SITE_DIR}
        rm -rf public_html
        ln -s {APP_DIR}/public public_html
        mkdir -p {APP_DIR}/tmp
        touch {APP_DIR}/tmp/restart.txt
        chmod -R g+rX {HOME}/.local || true
        """,
    )

    print("\nDeploy finished. Waiting for Passenger restart...")
    time.sleep(5)
    run(docker, f"test -f {APP_DIR}/.next/BUILD_ID && cat {APP_DIR}/.next/BUILD_ID")

    docker.close()
    outer.close()
    print("\nDone: https://kinoregin.ru")


if __name__ == "__main__":
    main()
