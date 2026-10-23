const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { SITE_URL, getBilingualRoutes, getWebRoutes } = require('./web-routes.cjs');
function validate(output = path.resolve(__dirname, '../dist-public')) {
  const marker = JSON.parse(fs.readFileSync(path.join(output, 'PUBLIC_BUILD.json'), 'utf8'));
  assert(marker.target === 'publication' && marker.schemaVersion === 2 && marker.englishRoutes === true && JSON.stringify(marker.locales) === '["es","en"]', 'Artefacto sin marcador de publicación bilingüe válido.');
  assert(!fs.existsSync(path.join(output, 'LOCAL_PREVIEW_ONLY.txt')), 'Se rechaza una vista previa.');
  assert(!fs.existsSync(path.join(output, 'en.html')), 'Portada inglesa duplicada.');
  for (const file of ['sw.js', 'robots.txt', 'manifest.json', 'version.json', '404.html', '.nojekyll']) assert(fs.existsSync(path.join(output, file)), 'Falta ' + file);
  const pageFile = route => path.join(output, route === '/' ? 'index.html' : route.endsWith('/') ? route.slice(1) + 'index.html' : route.slice(1) + '.html');
  const tags = (html, tag) => [...html.matchAll(new RegExp('<' + tag + '\\b[^>]*>', 'gi'))].map(([text]) => Object.fromEntries([...text.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(([, k, v]) => [k.toLowerCase(), v])));
  const indexed = new Set();
  const pairs = getBilingualRoutes();
  for (const [id, routes] of pairs) for (const locale of ['es', 'en']) {
    const route = routes[locale], html = fs.readFileSync(pageFile(route), 'utf8');
    const head = html.split('</head>')[0], links = tags(head, 'link'), metas = tags(head, 'meta');
    assert.equal(tags(html, 'html')[0].lang, locale, 'lang incorrecto: ' + route);
    assert.deepEqual(links.filter(t => t.rel === 'canonical').map(t => t.href), [SITE_URL + route], 'canonical incorrecto: ' + route);
    for (const [lang, target] of [['es', routes.es], ['en', routes.en], ['x-default', routes.es]]) assert.deepEqual(links.filter(t => t.rel === 'alternate' && t.hreflang === lang).map(t => t.href), [SITE_URL + target], 'hreflang incorrecto: ' + route + ' / ' + lang);
    const robots = metas.filter(t => t.name === 'robots');
    assert.equal(robots.length, 1, 'robots duplicado/ausente: ' + route);
    assert.equal(robots[0].content, id === 'guide' ? 'noindex, nofollow' : 'index, follow', 'Indexación incorrecta: ' + route);
    assert(metas.some(t => t.name === 'description' && t.content), 'Falta descripción: ' + route);
    assert(!head.includes('localhost'), 'Referencia local en metadatos: ' + route);
    for (const script of tags(html, 'script').filter(t => t.src && !/^https?:/.test(t.src))) assert(fs.existsSync(path.join(output, script.src.replace(/^\//, ''))), 'Falta JS: ' + script.src);
    if (id !== 'guide') indexed.add(SITE_URL + route);
    if (locale === 'en') {
      if (id === 'home') assert(html.includes('Have you found a wild animal'), 'Portada inglesa incompleta.');
      if (id === 'swifts' || id === 'bats') assert.equal((html.match(/<details\b/g) || []).length, id === 'swifts' ? 54 : 6, 'FAQ incompletas.');
      if (id === 'centers') assert.equal((html.match(/class="centros-province"/g) || []).length, 50, 'Directorio incompleto.');
    }
  }
  for (const route of Object.values(getWebRoutes())) assert(fs.existsSync(pageFile(route.es)), 'Falta ruta española: ' + route.es);
  const sitemap = fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.equal(locations.length, indexed.size, 'Sitemap incompleto o duplicado.');
  assert.deepEqual([...new Set(locations)].sort(), [...indexed].sort(), 'URLs incorrectas en sitemap.');
  assert.equal((sitemap.match(/<xhtml:link /g) || []).length, indexed.size * 3, 'Faltan alternates del sitemap.');
  assert(fs.readFileSync(path.join(output, 'sw.js'), 'utf8').includes('en/index.html'), 'El precache no incluye inglés.');
  require('./assert-bilingual-seo.cjs').validateSeo(output);
  console.log(`Artefacto bilingüe válido: ${pairs.length * 2} rutas equivalentes, historial español y ${indexed.size} URL en sitemap.`);
  return { routes: pairs.length * 2, indexed: indexed.size };
}
module.exports = { validate };
if (require.main === module) validate();
