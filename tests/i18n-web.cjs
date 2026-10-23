// Phase 2A integration against the current Spanish UI, with isolated browser storage.
const assert = require("node:assert/strict");
const { withBrowser } = require("./browser-local.cjs");

withBrowser(async ({ origin, newContext }) => {
  for (const locale of ["es-ES", "en-GB"]) {
    const context = await newContext({ locale });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error" && /hydration|hydrating|did not match|Minified React error/i.test(message.text())) errors.push(message.text());
    });
    await context.addInitScript(() => localStorage.setItem("sosFauna:preferredLocale", "en"));
    const savedCase = {
      id: "i18n-2a-current", createdAt: "2026-10-19T10:00:00.000Z",
      updatedAt: "2026-10-19T10:00:00.000Z", completedAt: null, step: 2,
      animalState: "alive", animalType: "bat", animalPosition: "ground",
      animalEnvironment: "urbanArea", flags: Object.fromEntries([
        "bleeding", "baby", "catDog", "canNotMove", "roadRisk", "ringGps", "trapped",
        "cannotFly", "weakness", "normalAppearance", "breathing", "stranded", "fishingLineHook",
        "moreAnimals", "peopleDogsNearby", "restingOnLand", "other"].map(key => [key, key === "baby"])),
      locationText: "Ubicación de prueba local", coords: null, locationCaptured: false,
    };
    await page.goto(origin + "/");
    await page.getByText("Guía de ayuda asistida", { exact: true }).first().waitFor();
    assert.equal(new URL(page.url()).pathname, "/");
    assert.equal(await page.locator("html").getAttribute("lang"), "es");
    assert.equal(await page.getByRole("button", { name: "English", exact: true }).count(), 0);
    await page.evaluate(value => {
      localStorage.setItem("@sos-fauna/current-case", JSON.stringify(value));
      localStorage.setItem("@sos-fauna/history", JSON.stringify([{ ...value, id: "i18n-2a-history", completedAt: value.updatedAt }]));
    }, savedCase);
    const storage = () => page.evaluate(() => ({
      current: localStorage.getItem("@sos-fauna/current-case"),
      history: localStorage.getItem("@sos-fauna/history"),
      preference: localStorage.getItem("sosFauna:preferredLocale"),
    }));
    const before = await storage();
    for (const slug of ["vencejos", "murcielagos"]) {
      await page.goto(origin + "/faq/" + slug);
      const input = page.getByRole("textbox", { name: "Buscar en las preguntas sobre " + (slug === "vencejos" ? "vencejos" : "murciélagos"), exact: true });
      await input.waitFor();
      await page.waitForFunction(() => Object.keys(document.querySelector("input")).some(key => key.startsWith("__reactProps")));
      assert.equal(await page.locator("html").getAttribute("lang"), "es");
      assert.equal(await page.locator("details").count(), slug === "vencejos" ? 54 : 6);
      await page.locator("summary").first().click();
      assert.equal(await page.locator("details[open]").count(), 1);
      await page.getByText("Volver a SOS Fauna España", { exact: true }).click();
      await page.getByText("Continuar aviso anterior", { exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, "/");
      assert.deepEqual(await storage(), before);
    }
    await page.getByText("Continuar aviso anterior", { exact: true }).click();
    await page.waitForURL(/\/aviso\?.*mode=continue/);
    await page.getByText("🦇 CRÍA DE MURCIÉLAGO", { exact: false }).first().waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("@sos-fauna/current-case")).id), savedCase.id);
    assert.equal(await page.locator("html").getAttribute("lang"), "es");
    assert.equal(await page.getByRole("button", { name: "English", exact: true }).count(), 0);
    await page.goto(origin + "/");
    await page.getByText("Ver avisos recientes", { exact: true }).click();
    await page.waitForURL(/\/history$/);
    await page.getByText("Mis avisos", { exact: true }).first().waitFor();
    assert.equal((await storage()).history, before.history);
    await page.goto(origin + "/");
    await page.getByText("Continuar aviso anterior", { exact: true }).waitFor();
    let cancelled = false;
    page.once("dialog", async dialog => { cancelled = true; await dialog.dismiss(); });
    await page.getByText("Guía de ayuda asistida", { exact: true }).first().click();
    await page.waitForTimeout(100);
    assert.equal(cancelled, true);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("@sos-fauna/current-case")).id), savedCase.id);
    page.once("dialog", dialog => dialog.accept());
    await page.getByText("Guía de ayuda asistida", { exact: true }).first().click();
    await page.getByText("Vivo", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log("PASS: " + locale + " browser + English preference keep Spanish; topic navigation, storage, recovery, history, cancel/confirm new case; no selector or hydration errors.");
    await context.close();
  }
  const offlineContext = await newContext({ locale: "en-GB", serviceWorkers: "allow" });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(origin + "/");
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
  await offlinePage.reload();
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  for (const slug of ["vencejos", "murcielagos"]) {
    await offlinePage.goto(origin + "/faq/" + slug);
    await offlinePage.getByRole("textbox").waitFor();
    assert.equal(await offlinePage.locator("html").getAttribute("lang"), "es");
    assert.equal(new URL(offlinePage.url()).pathname, "/faq/" + slug);
    assert.equal(await offlinePage.locator("details").count(), slug === "vencejos" ? 54 : 6);
  }
  await offlineContext.close();
  console.log("PASS: Spanish topic pages still load offline with an English browser.");
}).catch(error => { console.error(error); process.exitCode = 1; });
