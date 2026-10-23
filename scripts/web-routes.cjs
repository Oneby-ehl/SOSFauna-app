const fs = require('node:fs');
const path = require('node:path');
const SITE_URL = 'https://sosfauna.es';
// Read the application's single route registry without introducing a second URL map.
function getWebRoutes() {
  const source = fs.readFileSync(path.join(__dirname, '../i18n/routes.ts'), 'utf8');
  return Object.fromEntries([...source.matchAll(/^\s*(\w+): \{ es: "([^"]+)", en: "([^"]+)" \}/gm)]
    .map(([, id, es, en]) => [id, { es, en }]));
}
function getBilingualRoutes() {
  // History has no English page: its existing selector fallback remains the home page.
  return Object.entries(getWebRoutes()).filter(([id]) => id !== 'history');
}
module.exports = { SITE_URL, getWebRoutes, getBilingualRoutes };
