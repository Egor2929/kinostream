#!/usr/bin/env python3
"""Upload prebuilt Next.js bundle to Beget (build locally, deploy artifacts)."""

from __future__ import annotations

import io
import os
import subprocess
import sys
import tarfile
import tempfile
import textwrap
import time
from pathlib import Path

import paramiko

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HOST = os.environ.get("BEGET_HOST", "martyntm.beget.tech")
USER = os.environ.get("BEGET_USER", "martyntm")
PASSWORD = os.environ.get("BEGET_PASSWORD", "")
HOME = "/home/m/martyntm"
SITE_DIR = f"{HOME}/kinoregin.ru"
APP_DIR = f"{SITE_DIR}/app"
NODE_DIR = f"{APP_DIR}/.node"
NODE_BIN = f"{NODE_DIR}/bin/node"
NPM_BIN = f"{NODE_DIR}/bin/npm"
NODE_VERSION = "v20.18.3"
NODE_TAR = f"node-{NODE_VERSION}-linux-x64.tar.xz"
NODE_URL = f"https://nodejs.org/dist/{NODE_VERSION}/{NODE_TAR}"
PATH_EXPORT = f"export PATH={NODE_DIR}/bin:$PATH"

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = [
    ".next",
    "public",
    "package.json",
    "package-lock.json",
    "server.js",
    "next.config.ts",
]


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 900) -> None:
    print(f"\n$ {cmd}")
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    if out.strip():
        print(out.rstrip())
    if err.strip():
        print(err.rstrip())
    if code != 0:
        raise RuntimeError(f"Failed ({code}): {cmd}")


def connect_docker(outer: paramiko.SSHClient) -> paramiko.SSHClient:
    transport = outer.get_transport()
    channel = transport.open_channel("direct-tcpip", ("localhost", 222), ("127.0.0.1", 0))
    inner = paramiko.SSHClient()
    inner.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    inner.connect(
        "localhost",
        username=USER,
        password=PASSWORD,
        sock=channel,
        allow_agent=False,
        look_for_keys=False,
    )
    return inner


def create_tarball() -> Path:
    archive = Path(tempfile.gettempdir()) / "kinoregin-deploy.tar.gz"
    print(f"Creating {archive} ...")
    with tarfile.open(archive, "w:gz") as tar:
        for name in ARTIFACTS:
            path = ROOT / name
            if not path.exists():
                raise FileNotFoundError(path)
            tar.add(path, arcname=name)
    print(f"Archive size: {archive.stat().st_size / 1024 / 1024:.1f} MB")
    return archive


def main() -> None:
    password = os.environ.get("BEGET_PASSWORD", "")
    tmdb = os.environ.get("TMDB_API_KEY", "")
    if not password or not tmdb:
        sys.exit("Set BEGET_PASSWORD and TMDB_API_KEY")

    archive = create_tarball()

    outer = paramiko.SSHClient()
    outer.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    outer.connect(HOST, username=USER, password=password, allow_agent=False, look_for_keys=False)
    docker = connect_docker(outer)

    remote_tar = f"{SITE_DIR}/kinoregin-deploy.tar.gz"
    run(docker, f"mkdir -p {APP_DIR}")

    print(f"Uploading to {remote_tar} ...")
    sftp = outer.open_sftp()
    sftp.put(str(archive), remote_tar)
    sftp.close()

    env = textwrap.dedent(
        f"""
        TMDB_API_KEY={tmdb}
        NEXT_PUBLIC_SITE_URL=https://kinoregin.ru
        NEXT_PUBLIC_AD_DURATION=15
        NODE_ENV=production
        """
    ).strip()

    htaccess = textwrap.dedent(
        f"""
        PassengerNodejs {NODE_BIN}
        PassengerAppRoot {APP_DIR}
        PassengerAppType node
        PassengerStartupFile server.js
        PassengerAppEnv production
        PassengerFriendlyErrorPages off
        PassengerMinInstances 1
        """
    ).strip()

    run(
        docker,
        f"""
        set -e
        mkdir -p {NODE_DIR}
        cd {NODE_DIR}
        if [ ! -x {NODE_BIN} ]; then
          wget -q {NODE_URL} -O {NODE_TAR}
          tar xf {NODE_TAR} --strip-components=1
          rm -f {NODE_TAR}
        fi
        cd {APP_DIR}
        rm -rf .next node_modules public package.json package-lock.json server.js next.config.ts
        tar xzf {remote_tar} -C {APP_DIR}
        rm -f {remote_tar}
        {PATH_EXPORT} && cd {APP_DIR} && rm -rf node_modules && npm ci
        cat > .env.production <<'EOF'
{env}
EOF
        cat > {SITE_DIR}/.htaccess <<'EOF'
{htaccess}
EOF
        cd {SITE_DIR}
        rm -rf public_html
        ln -s {APP_DIR}/public public_html
        mkdir -p {APP_DIR}/tmp
        touch {APP_DIR}/tmp/restart.txt
        chmod -R a+rX {NODE_DIR} {APP_DIR}/.next {APP_DIR}/public {APP_DIR}/server.js
        find {APP_DIR}/node_modules -name '*.node' -exec chmod a+rx {{}} +
        chmod -R a+rx {APP_DIR}/node_modules/.bin
        test -f {APP_DIR}/.next/BUILD_ID && cat {APP_DIR}/.next/BUILD_ID
        """,
        timeout=900,
    )

    docker.close()
    outer.close()
    archive.unlink(missing_ok=True)
    print("\nDone: https://kinoregin.ru")


if __name__ == "__main__":
    main()
