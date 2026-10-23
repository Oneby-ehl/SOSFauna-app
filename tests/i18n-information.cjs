// Exact comparison of information pages before/after Spanish text extraction.
/* global __dirname */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { withBrowser } = require("./browser-local.cjs");

const root = path.resolve(__dirname, "..");
const baselineFile = path.join(root, ".expo/i18n-2c/information-before.json");
const capture = process.argv.includes("--capture");
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
assert.equal(fs.existsSync(baselineFile), !capture, capture ? "Do not overwrite the original baseline" : "Capture before extracting texts");

function htmlSnapshot(dir, prefix = "") {
  return Object.fromEntries(fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    const name = prefix + entry.name;
    if (entry.isDirectory()) return Object.entries(htmlSnapshot(file, name + "/"));
    if (!name.endsWith(".html")) return [];
    const html = fs.readFileSync(file, "utf8").replace(/_expo\/static\/js\/web\/entry-[a-f0-9]+\.js/g, "_expo/static/js/web/entry-HASH.js");
    return [[name, digest(html)]];
  }));
}

withBrowser(async ({ origin, newContext, dist }) => {
  const snapshots = { html: htmlSnapshot(dist), sitemap: digest(fs.readFileSync(path.join(dist, "sitemap.xml"))), protected: {}, screens: {} };
  const protectedFiles = Object.keys(JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/faq-before-seo.json"), "utf8")).protectedHashes);
  for (const file of [...protectedFiles, "components/home/LandingPage.tsx", "components/AppVersionFooter.tsx", "components/AppVersionGate.tsx",
    "components/external-link.tsx", "utils/rescueShareMessage.ts", "app/_layout.tsx", "app/+html.tsx", "components/seo/SeoHead.tsx",
    "app.json", "package.json", "package-lock.json", "scripts/generate-sitemap.js", "workbox-config.js"]) {
    snapshots.protected[file] = digest(fs.readFileSync(path.join(root, file)));
  }
  for (const route of ["about", "sources", "contact", "privacy", "legal"]) {
    for (const width of [390, 1280]) {
      const context = await newContext({ viewport: { width, height: 844 }, locale: "en-GB" });
      await context.addInitScript(() => {
        localStorage.setItem("sosFauna:preferredLocale", "en");
        localStorage.setItem("sosFauna:lastVersionCheckAt", new Date().toISOString());
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => {
        if (message.type() === "error" && /hydration|hydrating|did not match|Minified React error/i.test(message.text())) errors.push(message.text());
      });
      await page.goto(origin + "/" + route);
      await page.waitForFunction(() => [...document.querySelectorAll('a[href="/"]')].some(node => Object.keys(node).some(key => key.startsWith("__reactProps"))));
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      assert.equal(new URL(page.url()).pathname, "/" + route);
      assert.equal(await page.locator("html").getAttribute("lang"), "es");
      assert.equal(await page.getByRole("button", { name: "English", exact: true }).count(), 0);
      const observed = await page.evaluate(() => ({
        text: document.body.innerText,
        dom: document.getElementById("root").innerHTML,
        links: [...document.querySelectorAll("a")].map(node => [node.getAttribute("href"), node.textContent, node.getAttribute("aria-label"), node.getAttribute("target")]),
        accessibility: [...document.querySelectorAll("[role], [aria-label], [tabindex]")].map(node => [node.tagName, node.getAttribute("role"), node.getAttribute("aria-label"), node.getAttribute("tabindex")]),
      }));
      const screenshot = digest(await page.screenshot({ fullPage: true, animations: "disabled" }));
      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => ({ tag: document.activeElement.tagName, label: document.activeElement.getAttribute("aria-label"), text: document.activeElement.textContent }));
      assert.notEqual(focus.tag, "BODY", "Keyboard navigation must reach an interactive element");
      snapshots.screens[route + "-" + width] = { observed, screenshot, focus };
      await page.getByText(route === "privacy" || route === "legal" ? "Volver al inicio" : "Volver a SOS Fauna España", { exact: true }).click();
      await page.getByText("Guía de ayuda asistida", { exact: true }).first().waitFor();
      assert.equal(new URL(page.url()).pathname, "/");
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  if (capture) {
    fs.mkdirSync(path.dirname(baselineFile), { recursive: true });
    fs.writeFileSync(baselineFile, JSON.stringify(snapshots));
    console.log("Captured information-page baseline: all static HTML, sitemap, excluded sources, ten mobile/desktop DOM/screenshots, accessibility and keyboard navigation.");
  } else {
    const baseline = JSON.parse(fs.readFileSync(baselineFile, "utf8"));
    assert.deepEqual(snapshots.html, baseline.html, "Static HTML changed");
    assert.equal(snapshots.sitemap, baseline.sitemap, "Sitemap changed");
    assert.deepEqual(snapshots.protected, baseline.protected, "Excluded source changed");
    assert.deepEqual(Object.keys(snapshots.screens), Object.keys(baseline.screens));
    for (const [name, screen] of Object.entries(snapshots.screens)) {
      assert.equal(digest(JSON.stringify(screen.observed)), digest(JSON.stringify(baseline.screens[name].observed)), name + ": DOM, text, links or accessibility changed");
      assert.equal(screen.screenshot, baseline.screens[name].screenshot, name + ": screenshot changed");
      assert.deepEqual(screen.focus, baseline.screens[name].focus, name + ": keyboard focus changed");
    }
    console.log("PASS: 18 HTML pages, sitemap and excluded sources unchanged; five information pages have identical mobile/desktop DOM, screenshots, links, accessibility and keyboard focus. Home navigation works, no hydration errors.");
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
