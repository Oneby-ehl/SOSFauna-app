// Focused release smoke: actual static export, isolated storage, no external requests.
const assert = require('node:assert/strict');
const { withBrowser } = require('./browser-local.cjs');
withBrowser(async ({ origin, newContext }) => {
  for (const [locale, expected] of [['es-ES', '/'], ['en-GB', '/en/'], ['fr-FR', '/en/']]) {
    const context = await newContext({ locale });
    const page = await context.newPage();
    const errors = [], flashes = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.exposeFunction('recordSpanishFlash', value => flashes.push(value));
    if (locale === 'en-GB') await context.route(origin + '/en/', async route => {
      // A slow document must not reveal the Spanish page after an arbitrary timeout.
      await new Promise(resolve => setTimeout(resolve, 2500));
      await route.continue();
    }, { times: 1 });
    if (expected === '/en/') await page.addInitScript(() => {
      const sample = () => {
        if (location.pathname === '/' && document.body && getComputedStyle(document.documentElement).visibility !== 'hidden') window.recordSpanishFlash(location.href);
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await page.goto(origin + '/');
    await page.waitForURL(url => url.pathname === expected);
    await page.getByText('EN', { exact: true }).waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), expected === '/' ? 'es' : 'en');
    assert.deepEqual(flashes, [], 'Spanish body was visible before the English redirect.');
    if (locale === 'es-ES') {
      await page.goto(origin + '/en/contact');
      await page.getByText('Contact', { exact: true }).first().waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      assert.equal(new URL(page.url()).pathname, '/en/contact');
    }
    if (locale === 'en-GB') {
      await page.getByText('ES', { exact: true }).click();
      await page.waitForURL(url => url.pathname === '/');
      await page.reload();
      await page.getByText('Guía de ayuda asistida', { exact: true }).first().waitFor();
      assert.equal(new URL(page.url()).pathname, '/');
      assert.equal(await page.evaluate(() => localStorage.getItem('sosFauna:preferredLocale')), 'es');
      await page.goto(origin + '/en/faq');
      await page.getByText('Frequently asked questions', { exact: true }).first().waitFor();
      await page.getByText('ES', { exact: true }).click();
      await page.waitForURL(url => url.pathname === '/faq');
      await page.getByText('EN', { exact: true }).click();
      await page.waitForURL(url => url.pathname === '/en/faq');
      await page.goto(origin + '/en/guide?mode=new');
      await page.getByText('Alive', { exact: true }).click();
      await page.getByText('Small bird', { exact: true }).click();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.getByText('Step 2. What to do now', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.getByText('Take photograph', { exact: true }).waitFor();
      const chooser = page.waitForEvent('filechooser');
      await page.getByText('Take photograph', { exact: true }).click();
      await (await chooser).setFiles({ name: 'release.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64') });
      await page.getByText('📷 Photograph: Added ✓', { exact: true }).waitFor();
      const existing = await page.getByText('📷 Photograph: Added ✓', { exact: true }).elementHandle();
      let navigations = 0;
      // replaceState intentionally updates the URL (and emits a same-document
      // frame event). Count document loads, not these in-place URL changes.
      page.on('request', request => { if (request.isNavigationRequest() && request.resourceType() === 'document') navigations++; });
      await page.getByText('ES', { exact: true }).click();
      await page.getByText('📷 Foto: Añadida ✓', { exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, '/aviso');
      assert.equal(new URL(page.url()).search, '?mode=new');
      assert(await existing.evaluate(element => element.isConnected), 'Assistant DOM was replaced.');
      await page.getByText('EN', { exact: true }).click();
      await page.getByText('📷 Photograph: Added ✓', { exact: true }).waitFor();
      assert.equal(new URL(page.url()).pathname, '/en/guide');
      assert(await existing.evaluate(element => element.isConnected), 'Assistant DOM was replaced.');
      assert.equal(navigations, 0, 'Language switching navigated/remounted the guide.');
    }
    assert.deepEqual(errors, [], 'Browser runtime errors.');
    await context.close();
  }
  console.log('PASS: static web ES/EN/fallback, no visible Spanish flash, manual preference/reload, direct English and equivalent FAQ; guide ES↔EN retains step and selected photo without navigation or DOM replacement.');
}).catch(error => { console.error(error); process.exitCode = 1; });
