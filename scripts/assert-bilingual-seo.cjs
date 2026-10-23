// Focused SEO validation of the already exported bilingual artifact.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { SITE_URL, getBilingualRoutes } = require('./web-routes.cjs');
function attributes(tag) { return Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(([, k, v]) => [k.toLowerCase(), v])); }
function tags(html, name) { return [...html.matchAll(new RegExp('<' + name + '\\b[^>]*>', 'gi'))].map(([tag]) => attributes(tag)); }
function text(html) { return html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function validateSeo(output = path.resolve(__dirname, '../dist-public')) {
  const indexed = getBilingualRoutes().filter(([id]) => id !== 'guide');
  const titles = new Set(), descriptions = new Set(), canonicalPages = new Map();
  const expectedFiles = new Set();
  for (const [, routes] of indexed) for (const locale of ['es', 'en']) {
    const route = routes[locale], file = path.resolve(output, route === '/' ? 'index.html' : route.endsWith('/') ? route.slice(1) + 'index.html' : route.slice(1) + '.html');
    expectedFiles.add(file);
    const html = fs.readFileSync(file, 'utf8'), head = html.split('</head>')[0];
    const title = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(([, value]) => value);
    const metas = tags(head, 'meta'), links = tags(head, 'link');
    assert.equal(title.length, 1, 'One SEO title: ' + route);
    assert(title[0].trim() && !titles.has(title[0]), 'Unique title: ' + route); titles.add(title[0]);
    const description = metas.filter(meta => meta.name === 'description');
    assert.equal(description.length, 1, 'One description: ' + route);
    assert(description[0].content.trim() && !descriptions.has(description[0].content), 'Unique description: ' + route); descriptions.add(description[0].content);
    assert.equal(metas.find(meta => meta.name === 'robots')?.content, 'index, follow', 'Indexable public URL: ' + route);
    assert.equal(tags(html, 'html')[0].lang, locale);
    const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1];
    assert(body && text(body).length > 600, 'Full static body without executing JavaScript: ' + route);
    // Check actual page wording as well as language metadata; official names are allowed.
    if (locale === 'en') assert(!/¿|Política de privacidad|Preguntas frecuentes sobre|Volver a SOS/.test(text(body)), 'Unexpected Spanish UI: ' + route);
    assert.deepEqual(links.filter(link => link.rel === 'canonical').map(link => link.href), [SITE_URL + route]);
    const alternates = links.filter(link => link.rel === 'alternate' && link.hreflang);
    assert.equal(alternates.length, 3);
    for (const [lang, target] of [['es', routes.es], ['en', routes.en], ['x-default', routes.es]]) assert.deepEqual(alternates.filter(link => link.hreflang === lang).map(link => link.href), [SITE_URL + target]);
    canonicalPages.set(SITE_URL + route, { alternates, route });
  }
  for (const [url, page] of canonicalPages) for (const link of page.alternates) {
    const target = canonicalPages.get(link.href);
    assert(target, 'Alternate/x-default must resolve to a public indexable URL: ' + link.href);
    if (link.hreflang !== 'x-default') assert(target.alternates.some(back => back.href === url), 'Reciprocal hreflang: ' + url);
  }
  const robots = fs.readFileSync(path.join(output, 'robots.txt'), 'utf8');
  assert(/^User-agent:\s*\*\s*$/mi.test(robots) && /^Allow:\s*\/\s*$/mi.test(robots), 'Public crawling allowed.');
  assert(!/^Disallow:\s*\S/m.test(robots), 'Review crawling rules before excluding any bilingual URL.');
  assert.deepEqual([...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gmi)].map(([, value]) => value), [SITE_URL + '/sitemap.xml']);
  const sitemap = fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  assert.equal(entries.length, canonicalPages.size);
  for (const [, xml] of entries) {
    const loc = xml.match(/<loc>([^<]+)<\/loc>/)?.[1], page = canonicalPages.get(loc);
    assert(page, 'Only public canonical pages in sitemap: ' + loc);
    const links = tags(xml, 'xhtml:link');
    assert.equal(links.length, 3);
    for (const alternate of page.alternates) assert(links.some(link => link.hreflang === alternate.hreflang && link.href === alternate.href), 'Sitemap and HTML alternates must match: ' + loc);
  }
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.resolve(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html') && !expectedFiles.has(file)) {
        const head = fs.readFileSync(file, 'utf8').split('</head>')[0];
        assert(tags(head, 'meta').some(meta => meta.name === 'robots' && /\bnoindex\b/.test(meta.content)), 'Internal/private route must be noindex: ' + path.relative(output, file));
      }
    }
  }
  walk(output);
  console.log(`SEO PASS: ${canonicalPages.size} independent static pages, unique titles/descriptions, reciprocal canonical/hreflang/x-default, XML alternates, robots and all internal pages excluded.`);
}
module.exports = { validateSeo };
if (require.main === module) validateSeo();
