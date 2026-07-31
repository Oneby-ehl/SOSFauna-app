const fs = require("fs");
const path = require("path");

const SITE_URL = "https://sosfauna.es";
const DIST_DIR = path.resolve(__dirname, "..", "dist");
const SITEMAP_PATH = path.join(DIST_DIR, "sitemap.xml");
const EXCLUDED_ROUTES = new Set([
  "/404",
  "/+not-found",
  "/aviso",
  "/history",
  "/modal",
]);

function fail(message) {
  console.error(`generate-sitemap: ${message}`);
  process.exit(1);
}

function getHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getHtmlFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function filePathToRoute(filePath) {
  const relativePath = path.relative(DIST_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.some((part) => part.startsWith("_"))) return null;
  if (parts.some((part) => part.startsWith("(") && part.endsWith(")"))) return null;

  const withoutExtension = relativePath.replace(/\.html$/, "");
  const routeParts = withoutExtension.split(path.sep).filter(Boolean);

  if (routeParts.at(-1) === "index") {
    routeParts.pop();
  }

  const route = routeParts.length === 0 ? "/" : `/${routeParts.join("/")}`;
  return route.replace(/\\/g, "/");
}

function hasNoIndex(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html);
}

function shouldIncludeRoute(route, filePath) {
  if (!route) return false;
  if (route !== "/" && route.startsWith("/_")) return false;
  if (EXCLUDED_ROUTES.has(route)) return false;
  if (hasNoIndex(filePath)) return false;

  return true;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sortRoutes(a, b) {
  if (a === "/") return -1;
  if (b === "/") return 1;
  return a.localeCompare(b);
}

if (!fs.existsSync(DIST_DIR)) {
  fail(`dist folder does not exist at ${DIST_DIR}. Run "expo export --platform web" first.`);
}

const routes = [
  ...new Set(
    getHtmlFiles(DIST_DIR)
      .map((filePath) => ({ filePath, route: filePathToRoute(filePath) }))
      .filter(({ filePath, route }) => shouldIncludeRoute(route, filePath))
      .map(({ route }) => route)
  ),
].sort(sortRoutes);

const urls = routes
  .map((route) => {
    const loc = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(SITEMAP_PATH, sitemap, "utf8");

console.log(`Sitemap generated with ${routes.length} pages.`);
console.log("Included routes:");
routes.forEach((route) => console.log(`- ${route}`));
console.log(`Sitemap written to ${SITEMAP_PATH}`);
