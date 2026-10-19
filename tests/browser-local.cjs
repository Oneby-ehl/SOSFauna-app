const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require(process.env.SOS_FAUNA_PLAYWRIGHT || "playwright");
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
async function withBrowser(test) {
  const server = http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
    catch { response.writeHead(400).end(); return; }
    const base = path.resolve(dist, "." + pathname);
    if (!base.startsWith(dist + path.sep) && base !== dist) { response.writeHead(403).end(); return; }
    let file = [base, base + ".html", path.join(base, "index.html")]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    const status = file ? 200 : 404;
    file ||= path.join(dist, "+not-found.html");
    const types = { ".html": "text/html; charset=utf-8", ".js": "application/javascript",
      ".json": "application/json", ".css": "text/css", ".xml": "application/xml",
      ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".ttf": "font/ttf" };
    response.writeHead(status, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  let browser;
  try {
    const executablePath = [process.env.SOS_FAUNA_BROWSER,
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"]
      .filter(Boolean).find((name) => fs.existsSync(name));
    browser = await chromium.launch({ headless: true, executablePath });
    const newContext = async (options = {}) => {
      const context = await browser.newContext({ serviceWorkers: "block", viewport: { width: 390, height: 844 }, ...options });
      await context.route("**/*", (route) => route.request().url().startsWith(origin + "/") ? route.continue() : route.abort());
      return context;
    };
    await test({ browser, origin, newContext, root, dist });
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
module.exports = { withBrowser };
