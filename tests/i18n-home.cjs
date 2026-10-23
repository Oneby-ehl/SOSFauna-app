// Exact before/after comparison for the Spanish home page. Local artifacts stay in .expo.
/* global __dirname */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { withBrowser } = require("./browser-local.cjs");
const root = path.resolve(__dirname, "..");
const baselineFile = path.join(root, ".expo/i18n-2b/home-before.json");
const capture = process.argv.includes("--capture");
const digest = value => crypto.createHash("sha256").update(value).digest("hex");

if (capture) assert.ok(!fs.existsSync(baselineFile), "Refusing to overwrite the phase 2B baseline");
else assert.ok(fs.existsSync(baselineFile), "Capture the current application before extracting texts");

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
  const snapshots = { html: htmlSnapshot(dist), protected: {}, screens: {}, interactions: {} };
  const protectedFiles = Object.keys(JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/faq-before-seo.json"), "utf8")).protectedHashes);
  for (const file of [...protectedFiles, "app/_layout.tsx", "app/+html.tsx", "components/seo/SeoHead.tsx", "components/AppVersionGate.tsx", "app.json", "package.json", "package-lock.json"]) {
    snapshots.protected[file] = digest(fs.readFileSync(path.join(root, file)));
  }
  // The application-share copy is in scope; the rescue summary must remain byte-identical.
  const sharing = fs.readFileSync(path.join(root, "utils/rescueShareMessage.ts"), "utf8");
  snapshots.protected.rescueShareFunctions = digest(sharing.slice(sharing.indexOf("type RescueShareMessageInput"), sharing.indexOf("export const SOS_FAUNA_SHARE_TITLE")));

  for (const width of [390, 1280]) {
    for (const pending of [false, true]) {
      const context = await newContext({ viewport: { width, height: 844 }, locale: "en-GB" });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => {
        if (message.type() === "error" && /hydration|hydrating|did not match|Minified React error/i.test(message.text())) errors.push(message.text());
      });
      await context.addInitScript(({ pending }) => {
        localStorage.setItem("sosFauna:preferredLocale", "en");
        // Suppress the unrelated update prompt; keep the real home storage and recovery.
        localStorage.setItem("sosFauna:lastVersionCheckAt", new Date().toISOString());
        if (pending && !localStorage.getItem("@sos-fauna/current-case")) {
          const item = {
            id: "home-phase-2b", createdAt: "2026-10-19T10:00:00.000Z", updatedAt: "2026-10-19T10:00:00.000Z",
            completedAt: null, step: 2, animalState: "alive", animalType: "bat", animalPosition: "ground", animalEnvironment: "urbanArea",
            flags: { baby: true }, locationText: "Ubicación de prueba local", coords: null, locationCaptured: false,
          };
          localStorage.setItem("@sos-fauna/current-case", JSON.stringify(item));
          localStorage.setItem("@sos-fauna/history", JSON.stringify([{ ...item, id: "home-history", completedAt: item.updatedAt }]));
        }
      }, { pending });
      await page.goto(origin + "/");
      await page.getByText("Guía de ayuda asistida", { exact: true }).first().waitFor();
      if (pending) await page.getByText("Continuar aviso anterior", { exact: true }).waitFor();
      await page.getByText("Comprobando…", { exact: true }).waitFor({ state: "hidden" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const name = width + (pending ? "-pending" : "-empty");
      const screenState = () => page.evaluate(() => ({
        text: document.body.innerText,
        dom: document.getElementById("root").innerHTML,
        lang: document.documentElement.lang,
        links: [...document.querySelectorAll("a")].map(node => [node.getAttribute("href"), node.textContent, node.getAttribute("aria-label")]),
      }));
      snapshots.screens[name] = { state: await screenState(), screenshot: digest(await page.screenshot({ fullPage: true, animations: "disabled" })) };
      assert.equal(new URL(page.url()).pathname, "/");
      assert.equal(await page.getByRole("button", { name: "English", exact: true }).count(), 0);

      await page.evaluate(() => {
        window.homeInstallCalls = 0;
        const event = new Event("beforeinstallprompt", { cancelable: true });
        event.prompt = async () => { window.homeInstallCalls += 1; };
        event.userChoice = Promise.resolve({ outcome: "dismissed", platform: "web" });
        window.dispatchEvent(event);
      });
      await page.getByText("Instalar aplicación", { exact: true }).waitFor();
      snapshots.screens[name + "-install"] = { state: await screenState(), screenshot: digest(await page.screenshot({ fullPage: true, animations: "disabled" })) };
      await page.getByText("Instalar aplicación", { exact: true }).click();
      await page.getByText("Instalar aplicación", { exact: true }).waitFor({ state: "hidden" });
      assert.equal(await page.evaluate(() => window.homeInstallCalls), 1);

      await page.evaluate(() => Object.defineProperty(navigator, "share", { configurable: true, value: async data => { window.homeShared = data; } }));
      await page.getByText("Compartir SOS Fauna España", { exact: true }).click();
      await page.waitForFunction(() => Boolean(window.homeShared));
      snapshots.interactions[name + "-share"] = await page.evaluate(() => window.homeShared);
      await page.evaluate(() => {
        Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async text => { window.homeCopied = text; } } });
      });
      let copiedMessage;
      page.once("dialog", async dialog => { copiedMessage = dialog.message(); await dialog.accept(); });
      await page.getByText("Compartir SOS Fauna España", { exact: true }).click();
      await page.waitForFunction(() => Boolean(window.homeCopied));
      snapshots.interactions[name + "-copy"] = { text: await page.evaluate(() => window.homeCopied), message: copiedMessage };

      if (pending) {
        const stored = await page.evaluate(() => localStorage.getItem("@sos-fauna/current-case"));
        let confirmation;
        page.once("dialog", async dialog => { confirmation = dialog.message(); await dialog.dismiss(); });
        await page.getByText("Guía de ayuda asistida", { exact: true }).first().click();
        await page.waitForTimeout(50);
        snapshots.interactions[name + "-confirmation"] = confirmation;
        assert.equal(await page.evaluate(() => localStorage.getItem("@sos-fauna/current-case")), stored);
        await page.getByText("Continuar aviso anterior", { exact: true }).click();
        await page.waitForURL(/\/aviso\?.*mode=continue/);
        await page.getByText("🦇 CRÍA DE MURCIÉLAGO", { exact: false }).first().waitFor();
      } else {
        await page.getByText("Guía de ayuda asistida", { exact: true }).first().click();
        await page.getByText("Vivo", { exact: true }).waitFor();
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  if (capture) {
    fs.mkdirSync(path.dirname(baselineFile), { recursive: true });
    fs.writeFileSync(baselineFile, JSON.stringify(snapshots));
    console.log("Captured phase 2B HTML, protected sources, desktop/mobile DOM and screenshots, installation, sharing, clipboard and confirmation baseline.");
  } else {
    assert.deepEqual(snapshots, JSON.parse(fs.readFileSync(baselineFile, "utf8")));
    console.log("PASS: all static HTML, protected sources, exact mobile/desktop DOM and screenshots, installation, shared/copy messages and confirmations unchanged; guide start/recovery work.");
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
