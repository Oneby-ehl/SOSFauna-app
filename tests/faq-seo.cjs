const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const zlib = require("node:zlib");
const { withBrowser } = require("./browser-local.cjs");
const { createHarness } = require("./faq-regression.cjs");

withBrowser(async ({ origin, newContext, root, dist }) => {
  const h = createHarness();
  const context = await newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|hydrating|did not match|Minified React error/i.test(message.text())) errors.push(message.text());
  });
  const html = (file) => fs.readFileSync(path.join(dist, file), "utf8");
  const topics = [
    { slug: "vencejos", count: 54, label: "Buscar en las preguntas sobre vencejos", items: h.data.faqItems.filter((item) => item.id.includes("vencejo")) },
    { slug: "murcielagos", count: 6, label: "Buscar en las preguntas sobre murciélagos", items: h.data.faqItems.filter((item) => item.id.startsWith("murcielago")) },
  ];
  const queries = ["", "agua", "caja", "cría", "no vuela", "gato", "vencejo", "murciélago", "caja.", "xyzsinresultado", "que la"];
  const outputDir = path.join(root, ".expo/seo-checks");
  fs.mkdirSync(outputDir, { recursive: true });
  for (const topic of topics) {
    const route = "/faq/" + topic.slug;
    const content = html("faq/" + topic.slug + ".html");
    const body = content.slice(content.indexOf("<body")).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    assert.equal(topic.items.length, topic.count);
    assert.equal(new Set(topic.items.map((item) => item.id)).size, topic.count);
    for (const item of topic.items) {
      assert.ok(body.includes(item.question), "Missing static question: " + item.id);
      assert.ok(body.includes(item.answer), "Missing static answer: " + item.id);
    }
    const staticContext = await newContext({ javaScriptEnabled: false });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(origin + route);
    assert.equal(await staticPage.locator("details").count(), topic.count);
    assert.equal(await staticPage.locator("details[open]").count(), 0);
    assert.equal(await staticPage.locator("h1").count(), 1, "Exactly one static H1");
    const before = await staticPage.locator("details").evaluateAll((nodes) => nodes.map((node) => ({ id: node.id, text: node.textContent })));
    await staticPage.locator("summary").first().focus();
    await staticPage.keyboard.press("Enter");
    assert.equal(await staticPage.locator("details[open]").count(), 1, "Accordion must work without JavaScript");
    await staticContext.close();

    await page.goto(origin + route);
    const input = page.getByRole("textbox", { name: topic.label, exact: true });
    await input.waitFor();
    await page.waitForFunction((label) => Object.keys(document.querySelector('input[aria-label="' + label + '"]')).some((key) => key.startsWith("__reactProps")), topic.label);
    const after = await page.locator("details").evaluateAll((nodes) => nodes.map((node) => ({ id: node.id, text: node.textContent })));
    assert.deepStrictEqual(after, before, "Hydration changed questions or answers");
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("h2").count(), topic.count);
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://sosfauna.es" + route);
    assert.ok(await page.locator('meta[name="description"]').getAttribute("content"));
    assert.ok(await page.title());
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute("content"), "https://sosfauna.es" + route);
    const schema = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(JSON.parse).find((item) => item["@type"] === "FAQPage");
    assert.deepStrictEqual(schema.mainEntity.map((item) => [item.name, item.acceptedAnswer.text]), JSON.parse(JSON.stringify(topic.items.map((item) => [item.question, item.answer]))));
    for (const query of queries) {
      await input.fill(query);
      const expected = h.search.searchFaqItems(topic.items, query).map((item) => item.id);
      await page.waitForFunction((ids) => JSON.stringify([...document.querySelectorAll("details")].map((node) => node.id)) === JSON.stringify(ids), expected);
    }
    await page.getByRole("button", { name: "Limpiar búsqueda", exact: true }).click();
    assert.equal(await page.locator("details").count(), topic.count);
    assert.equal(await input.evaluate((node) => node === document.activeElement), true);
    await page.screenshot({ path: path.join(outputDir, topic.slug + "-mobile.png") });
    await page.locator("summary").first().focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("details[open]").count(), 1);
    await page.screenshot({ path: path.join(outputDir, topic.slug + "-expanded.png") });
    await page.keyboard.press("Space");
    assert.equal(await page.locator("details[open]").count(), 0);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "Horizontal overflow at " + width);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const destination of ["/", "/faq", "/centros"]) assert.ok(await page.locator('a[href="' + destination + '"]').count());
    console.log("PASS: " + route + ": " + topic.count + " full answers in static HTML, matching hydration, metadata, keyboard and 11 searches.");
  }
  for (const route of ["/", "/faq"]) {
    await page.goto(origin + route);
    for (const topic of topics) assert.ok(await page.locator('a[href="/faq/' + topic.slug + '"]').count());
  }
  const sitemap = html("sitemap.xml");
  for (const topic of topics) assert.ok(sitemap.includes("<loc>https://sosfauna.es/faq/" + topic.slug + "</loc>"));
  for (const route of ["aviso", "history", "modal", "explore", "+not-found"]) {
    assert.ok(!sitemap.includes("<loc>https://sosfauna.es/" + route + "</loc>"));
    assert.match(html(route + ".html"), /name="robots" content="noindex, nofollow"/);
  }
  console.log("PASS: crawlable links, sitemap and internal noindex.");
  const reference = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/faq-before-seo.json"), "utf8"));
  const assets = fs.readdirSync(path.join(dist, "_expo/static/js/web")).filter((name) => name.endsWith(".js"));
  const javascript = assets.map((name) => {
    const bytes = fs.readFileSync(path.join(dist, "_expo/static/js/web", name));
    return { name, bytes: bytes.length, gzipBytes: zlib.gzipSync(bytes).length };
  });
  const beforeBytes = reference.exportReference.javascript.reduce((sum, item) => sum + item.bytes, 0);
  const afterBytes = javascript.reduce((sum, item) => sum + item.bytes, 0);
  assert.ok(afterBytes - beforeBytes < 50000, "Unexpected JS increase above 50 KB");
  console.log("Performance:", JSON.stringify({ beforeBytes, afterBytes, deltaBytes: afterBytes - beforeBytes, javascript,
    faqBytes: Buffer.byteLength(html("faq.html")), homeBytes: Buffer.byteLength(html("index.html")),
    topicBytes: topics.map((topic) => ({ topic: topic.slug, bytes: Buffer.byteLength(html("faq/" + topic.slug + ".html")) })) }));
  assert.deepStrictEqual(errors, [], "Browser/hydration errors");
  const offlineContext = await newContext({ serviceWorkers: "allow" });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(origin + "/");
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; });
  await offlinePage.reload();
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  for (const topic of topics) {
    await offlinePage.goto(origin + "/faq/" + topic.slug);
    await offlinePage.getByRole("textbox", { name: topic.label, exact: true }).waitFor();
    assert.equal(await offlinePage.locator("details").count(), topic.count);
  }
  await offlineContext.close();
  console.log("PASS: both topic routes available offline after service worker installation.");
  await context.close();
}).catch((error) => { console.error(error); process.exitCode = 1; });
