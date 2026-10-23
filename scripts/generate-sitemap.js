const fs = require('node:fs');
const path = require('node:path');
const { SITE_URL, getBilingualRoutes } = require('./web-routes.cjs');
const dist = path.resolve(__dirname, '../dist');
const indexed = getBilingualRoutes().filter(([id]) => id !== 'guide');
function htmlFile(route) { return path.join(dist, route === '/' ? 'index.html' : route.endsWith('/') ? route.slice(1) + 'index.html' : route.slice(1) + '.html'); }
function escapeXml(value) { return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
const urls = indexed.flatMap(([, routes]) => ['es', 'en'].map(locale => {
  const route = routes[locale], html = fs.readFileSync(htmlFile(route), 'utf8');
  if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) throw new Error('Página de sitemap no indexable: ' + route);
  const alternates = [['es', routes.es], ['en', routes.en], ['x-default', routes.es]].map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(SITE_URL + href)}" />`).join('\n');
  return `  <url>\n    <loc>${escapeXml(SITE_URL + route)}</loc>\n${alternates}\n  </url>`;
}));
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`Sitemap bilingüe: ${urls.length} páginas indexables.`);
