// Only SEO/crawlability checks requested for the bilingual release.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { getBilingualRoutes, SITE_URL } = require('../scripts/web-routes.cjs');
const cache = new Map();
function load(name) {
  if (cache.has(name)) return cache.get(name);
  const exports = {};
  const file = path.resolve(__dirname, '../i18n', name + '.ts');
  cache.set(name, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, { exports, require: specifier => load(specifier.replace(/^\.\//, '')) });
  return exports;
}
const selection = load('selection');
const crawlers = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)',
];
for (const userAgent of crawlers) {
  const document = { documentElement: { dataset: {}, style: {} } };
  let redirected = false;
  vm.runInNewContext(selection.initialLanguageScript, { document, navigator: { userAgent, languages: ['en-US'] }, location: { pathname: '/', search: '', hash: '', replace: () => redirected = true }, localStorage: { getItem: () => 'en' } });
  assert(!redirected && !document.documentElement.style.visibility, 'Head must not hide/redirect a crawler.');
  assert.equal(selection.resolveInitialNavigation({ url: '/', platform: 'web', preferredLocale: 'en', browserLanguages: ['en-US'], userAgent, entryIntent: 'initial-home' }).redirectTo, null, 'Hydration must not reintroduce the redirect.');
}
const { withBrowser } = require('./browser-local.cjs');
withBrowser(async ({ origin, newContext }) => {
  const staticContext = await newContext({ javaScriptEnabled: false, userAgent: crawlers[0], locale: 'en-US' });
  const page = await staticContext.newPage();
  let count = 0;
  for (const [, routes] of getBilingualRoutes().filter(([id]) => id !== 'guide')) for (const locale of ['es', 'en']) {
    const route = routes[locale], response = await page.goto(origin + route);
    assert.equal(response.status(), 200, 'Independent URL must return HTTP 200: ' + route);
    assert.equal(new URL(page.url()).pathname, route);
    assert.equal(await page.locator('html').getAttribute('lang'), locale);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), SITE_URL + route);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index, follow');
    assert((await page.locator('body').innerText()).length > 100, 'Visible static body: ' + route);
    const headers = await response.allHeaders();
    assert(!/noindex/i.test(headers['x-robots-tag'] || ''), 'No HTTP noindex: ' + route);
    count++;
  }
  await staticContext.close();
  for (const userAgent of crawlers) {
    const context = await newContext({ userAgent, locale: 'en-US' });
    await context.addInitScript(() => localStorage.setItem('sosFauna:preferredLocale', 'en'));
    const crawlerPage = await context.newPage();
    const errors = [];
    crawlerPage.on('pageerror', error => errors.push(error.message));
    for (const [route, locale] of [['/', 'es'], ['/en/', 'en']]) {
      assert.equal((await crawlerPage.goto(origin + route)).status(), 200);
      await crawlerPage.waitForFunction(() => Object.keys(document.querySelector('[role="button"]') || {}).some(key => key.startsWith('__reactProps')));
      await crawlerPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(new URL(crawlerPage.url()).pathname, route, 'Crawler must stay on requested language URL.');
      assert.equal(await crawlerPage.locator('html').getAttribute('lang'), locale);
      assert.notEqual(await crawlerPage.locator('html').evaluate(element => getComputedStyle(element).visibility), 'hidden');
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  const human = await newContext({ locale: 'en-GB' });
  const humanPage = await human.newPage();
  await humanPage.goto(origin + '/');
  await humanPage.waitForURL(url => url.pathname === '/en/');
  await human.close();
  const internal = await newContext();
  const internalPage = await internal.newPage();
  await internalPage.goto(origin + '/_sitemap');
  await internalPage.waitForLoadState('networkidle');
  assert.match(await internalPage.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
  await internal.close();
  console.log(`SEO BROWSER PASS: ${count} independent HTTP 200 pages with visible HTML and JavaScript disabled; Googlebot desktop/mobile and Inspection Tool keep ES/EN URLs after hydration; human detection unchanged; internal sitemap noindex.`);
}).catch(error => { console.error(error); process.exitCode = 1; });
