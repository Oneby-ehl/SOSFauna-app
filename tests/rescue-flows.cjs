const assert = require("node:assert/strict");
const { withBrowser } = require("./browser-local.cjs");
withBrowser(async ({ origin, newContext }) => {
  const context = await newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const savedCase = {
    id: "seo-local-regression-case", createdAt: "2026-10-19T10:00:00.000Z",
    updatedAt: "2026-10-19T10:00:00.000Z", completedAt: null, step: 2,
    animalState: "alive", animalType: "bat", animalPosition: "ground",
    animalEnvironment: "urbanArea", flags: Object.fromEntries([
      "bleeding", "baby", "catDog", "canNotMove", "roadRisk", "ringGps", "trapped",
      "cannotFly", "weakness", "normalAppearance", "breathing", "stranded", "fishingLineHook",
      "moreAnimals", "peopleDogsNearby", "restingOnLand", "other"].map((key) => [key, key === "baby"])),
    locationText: "Ubicación de prueba local", coords: null, locationCaptured: false,
  };
  await page.goto(origin + "/");
  await page.evaluate((value) => {
    localStorage.setItem("@sos-fauna/current-case", JSON.stringify(value));
    localStorage.setItem("@sos-fauna/history", JSON.stringify([{ ...value, id: "seo-history-case", completedAt: value.updatedAt }]));
  }, savedCase);
  for (const slug of ["vencejos", "murcielagos"]) {
    await page.goto(origin + "/faq/" + slug);
    await page.getByRole("link", { name: "Ir al inicio y abrir el asistente", exact: true }).click();
    await page.getByText("Continuar aviso anterior", { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("@sos-fauna/current-case")).id), savedCase.id);
  }
  await page.getByText("Continuar aviso anterior", { exact: true }).click();
  await page.waitForURL(/\/aviso\?.*mode=continue/);
  await page.getByText("Recuperando aviso…", { exact: true }).waitFor({ state: "hidden" });
  await page.getByText("🦇 CRÍA DE MURCIÉLAGO", { exact: false }).first().waitFor();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("@sos-fauna/current-case")).id), savedCase.id);
  await page.goto(origin + "/");
  await page.getByText("Ver avisos recientes", { exact: true }).click();
  await page.waitForURL(/\/history$/);
  await page.getByText("Mis avisos", { exact: true }).first().waitFor();
  await page.goto(origin + "/");
  await page.getByText("Continuar aviso anterior", { exact: true }).waitFor();
  let confirmed = false;
  page.once("dialog", async (dialog) => { confirmed = true; await dialog.dismiss(); });
  await page.getByText("Comenzar nuevo aviso", { exact: true }).click();
  await page.waitForTimeout(100);
  assert.equal(confirmed, true);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("@sos-fauna/current-case")).id), savedCase.id);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByText("Comenzar nuevo aviso", { exact: true }).click();
  // The existing assistant manages history entries itself; assert the active screen.
  await page.getByText("Vivo", { exact: true }).waitFor();
  assert.deepStrictEqual(errors, []);
  console.log("PASS: topic links preserve current case; continue/recovery, history, cancel and confirm new case.");
  await context.close();
}).catch((error) => { console.error(error); process.exitCode = 1; });
