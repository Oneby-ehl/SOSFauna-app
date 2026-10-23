// Phase 2D: compare the real directory and shared help UI with their pre-extraction state.
/* global __dirname */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { withBrowser } = require("./browser-local.cjs");
const root = path.resolve(__dirname, "..");
const baselineFile = path.join(root, ".expo/i18n-2d/centers-before.json");
const capture = process.argv.includes("--capture");
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
assert.equal(fs.existsSync(baselineFile), !capture, "Capture once before editing; never overwrite the baseline");

function htmlSnapshot(dir, prefix = "") {
  return Object.fromEntries(fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name), name = prefix + entry.name;
    if (entry.isDirectory()) return Object.entries(htmlSnapshot(full, name + "/"));
    if (!name.endsWith(".html")) return [];
    return [[name, digest(fs.readFileSync(full, "utf8").replace(/_expo\/static\/js\/web\/entry-[a-f0-9]+\.js/g, "_expo/static/js/web/entry-HASH.js"))]];
  }));
}

withBrowser(async ({ origin, newContext, dist }) => {
  const snapshots = { html: htmlSnapshot(dist), sitemap: digest(fs.readFileSync(path.join(dist, "sitemap.xml"))), protected: {}, helpers: {}, screens: {}, filters: {}, shared: {} };
  const excluded = new Set([
    ...Object.keys(JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/faq-before-seo.json"), "utf8")).protectedHashes),
    ...Object.keys(JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/centros-before-seo.json"), "utf8")).protected),
    "components/contacts/PublicRecoveryCenters.tsx", "components/SectionCard.tsx", "app/_layout.tsx", "app/+html.tsx", "i18n/config.ts", "i18n/routes.ts",
    "components/home/LandingPage.tsx", "components/home/AboutPage.tsx", "components/home/SourcesPage.tsx", "components/home/ContactPage.tsx",
    "components/home/PrivacyPage.tsx", "components/home/LegalPage.tsx", "components/AppVersionFooter.tsx", "utils/rescueShareMessage.ts", "app.json", "package.json", "package-lock.json",
  ]);
  for (const file of excluded) snapshots.protected[file] = digest(fs.readFileSync(path.join(root, file)));
  const code = fs.readFileSync(path.join(root, "components/contacts/RecoveryCentersPage.tsx"), "utf8");
  const ast = ts.createSourceFile("RecoveryCentersPage.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const name of ["normalizeProvinceSearch", "callNumber", "getVisibleContactCount", "getProvinceHelpGroups"]) {
    const declaration = ast.statements.filter(ts.isVariableStatement).flatMap(node => node.declarationList.declarations).find(node => node.name.getText(ast) === name);
    snapshots.helpers[name] = declaration.getText(ast);
  }
  const contacts = page => page.locator(".centros-province").evaluateAll(nodes => nodes.map(node => ({
    province: node.dataset.province,
    rows: [...node.querySelectorAll(".centros-group li")].map(row => ({
      name: row.querySelector(".centros-contact-name").textContent,
      note: row.querySelector(".centros-contact-note").textContent,
      type: row.querySelector(".centros-contact-type")?.textContent ?? null,
      phone: row.querySelector(".centros-contact-phone")?.textContent ?? null,
      href: row.querySelector("a")?.getAttribute("href") ?? null,
    })),
  })));
  async function checkInventory(page) {
    const groups = await contacts(page);
    assert.equal(groups.length, 50);
    assert.equal(groups.reduce((sum, group) => sum + group.rows.length, 0), 129);
    assert.equal(await page.locator(".centros-national a[href^='tel:']").count(), 4);
    return groups;
  }

  const staticContext = await newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(origin + "/centros");
  snapshots.staticContacts = await checkInventory(staticPage);
  assert.equal(await staticPage.locator(".public-centros details[open]").count(), 0);
  await staticPage.locator(".centros-directory > summary").focus();
  await staticPage.keyboard.press("Enter");
  const staticMadrid = staticPage.locator('.centros-province[data-province="Madrid"]');
  await staticMadrid.locator("summary").focus();
  await staticPage.keyboard.press("Enter");
  assert.ok(await staticMadrid.locator('a[href="tel:627461457"]').isVisible());
  assert.ok(await staticMadrid.locator(".centros-province-hide").isVisible());
  await staticPage.keyboard.press("Space");
  assert.equal(await staticMadrid.getAttribute("open"), null);
  assert.ok(await staticMadrid.locator(".centros-province-view").isVisible());
  await staticContext.close();

  for (const width of [320, 390, 768, 1280]) {
    const context = await newContext({ viewport: { width, height: 844 }, locale: "en-GB" });
    await context.addInitScript(() => {
      localStorage.setItem("sosFauna:preferredLocale", "en");
      localStorage.setItem("sosFauna:lastVersionCheckAt", new Date().toISOString());
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error" && /hydrati|did not match|Minified React error/i.test(message.text())) errors.push(message.text()); });
    await page.goto(origin + "/centros");
    await page.waitForFunction(() => Object.keys(document.querySelector("#centros-province-search")).some(key => key.startsWith("__reactProps")));
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    assert.deepEqual(await checkInventory(page), snapshots.staticContacts, "Hydration changed contacts");
    assert.equal(await page.locator("html").getAttribute("lang"), "es");
    const screen = async name => {
      snapshots.screens[width + "-" + name] = {
        dom: digest(await page.locator("#root").innerHTML()),
        screenshot: digest(await page.screenshot({ fullPage: true, animations: "disabled" })),
      };
    };
    await screen("closed");
    await page.locator(".centros-directory > summary").click();
    const input = page.getByRole("searchbox", { name: "Buscar provincia", exact: true });
    for (const query of ["ÁVILA", "avila", "  Ávila  ", "MALAGA", "málaga", "A CORUÑA", "coruna", "Madrid", "mallorca", "ibiza", "menorca", "formentera", "ningunaprovincia"]) {
      await input.fill(query);
      const visible = await page.locator(".centros-province:not([hidden])").evaluateAll(nodes => nodes.map(node => node.dataset.province));
      snapshots.filters[width + ":" + query] = visible;
      assert.equal(await page.locator(".centros-province").count(), 50);
      assert.equal(await page.locator(".centros-group li").count(), 129);
      if (["ÁVILA", "avila", "  Ávila  "].includes(query)) assert.deepEqual(visible, ["Ávila"]);
      if (["MALAGA", "málaga"].includes(query)) assert.deepEqual(visible, ["Málaga"]);
      if (query === "ningunaprovincia") assert.ok(await page.getByRole("status").isVisible());
    }
    await screen("no-results");
    await page.getByRole("button", { name: "Limpiar búsqueda de provincia", exact: true }).click();
    assert.equal(await input.inputValue(), "");
    assert.ok(await input.evaluate(node => node === document.activeElement));
    assert.equal(await page.locator(".centros-province:not([hidden])").count(), 50);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.tagName), "SUMMARY");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".centros-province[open]").count(), 1);
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".centros-province[open]").count(), 0);
    for (const province of ["Madrid", "Mallorca"]) await page.locator('.centros-province[data-province="' + province + '"] > summary').click();
    assert.equal(await page.locator(".centros-province[open]").count(), 2);
    await page.locator(".centros-sources > summary").click();
    await page.locator("body").click({ position: { x: 1, y: 1 } });
    await screen("expanded");
    assert.ok(await page.locator(".public-centros").evaluate(element => [element, ...element.querySelectorAll("*")].every(node => {
      const bounds = node.getBoundingClientRect(); return !bounds.width || (bounds.left >= 0 && bounds.right <= innerWidth + 1);
    })));
    assert.deepEqual(errors, []);
    await context.close();
  }

  // Exercise the same shared component used inside the existing assistant, without editing it.
  const context = await newContext();
  const page = await context.newPage();
  const sharedErrors = [];
  page.on("pageerror", error => sharedErrors.push(error.message));
  await page.goto(origin + "/");
  const seed = {
    id: "centers-phase-2d", createdAt: "2026-10-19T10:00:00.000Z", updatedAt: "2026-10-19T10:00:00.000Z", completedAt: null, step: 4,
    animalState: "alive", animalType: "smallBird", animalPlace: null, animalPosition: null, animalEnvironment: null,
    flags: {}, locationText: "Prueba local", coords: { latitude: 40.4, longitude: -3.7 }, locationCaptured: true,
  };
  await page.evaluate(value => localStorage.setItem("@sos-fauna/current-case", JSON.stringify(value)), seed);
  await page.goto(origin + "/aviso?mode=continue");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByText("Ayuda", { exact: true }).first().click();
  const card = title => page.getByText(title, { exact: true }).locator("..");
  snapshots.shared.help = await card("Teléfonos de ayuda").innerHTML();
  await page.getByText("Fuentes y aviso legal", { exact: true }).click();
  snapshots.shared.legal = await card("Teléfonos de ayuda").innerHTML();
  await page.getByText("📍 Buscar ayuda en mi provincia", { exact: true }).click();
  const search = page.getByPlaceholder("Buscar provincia");
  await search.fill("madrid");
  snapshots.shared.filter = await card("Teléfonos por provincias").innerHTML();
  await page.getByText("Madrid", { exact: true }).click();
  assert.ok(await page.getByText("GREFA guardia", { exact: true }).isVisible());
  assert.ok(await page.getByText("627 461 457", { exact: true }).isVisible());
  snapshots.shared.madrid = await card("Madrid").innerHTML();
  assert.equal(await page.locator("details").count(), 0);
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await search.waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("@sos-fauna/current-case")).id), seed.id);
  assert.deepEqual(sharedErrors, []);
  await context.close();

  if (capture) {
    fs.mkdirSync(path.dirname(baselineFile), { recursive: true });
    fs.writeFileSync(baselineFile, JSON.stringify(snapshots));
    console.log("Captured pre-2D directory baseline: HTML, data, 50 groups/129 provincial/4 national contacts, four widths, filters, native accordions and shared assistant help.");
  } else {
    const before = JSON.parse(fs.readFileSync(baselineFile, "utf8"));
    for (const key of ["html", "sitemap", "protected", "helpers", "staticContacts", "filters", "screens"]) assert.deepEqual(snapshots[key], before[key], "Directory changed: " + key);
    for (const key of Object.keys(snapshots.shared)) assert.equal(digest(snapshots.shared[key]), digest(before.shared[key]), "Shared help changed: " + key);
    console.log("PASS: 18 static HTML files and sitemap identical; data/helpers preserved; 50 groups, 129 provincial and 4 national contacts; four-width DOM/screenshots, 13 filter queries, clear/focus, no-JS details, keyboard, phones and shared guide help unchanged.");
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
