const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

module.exports = app.prepare().then(() =>
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }),
);
