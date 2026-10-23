// Separate local preview and validated bilingual publication artifacts.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { getBilingualRoutes, getWebRoutes } = require('./web-routes.cjs');
const root = path.resolve(__dirname, '..');
const mode = process.argv[2];
if (mode !== 'preview' && mode !== 'publication') throw new Error('Destino de compilación no válido.');
const preview = mode === 'preview';
if (preview && (process.env.CI || process.env.GITHUB_ACTIONS)) throw new Error('La vista previa está bloqueada en CI.');
const dist = path.join(root, 'dist');
const publicDist = path.join(root, 'dist-public');
const routerRoot = path.join(root, '.expo', 'bilingual-web', 'app');
function removeBuildDirectory(target) {
  const resolved = path.resolve(target);
  if (![dist, publicDist, routerRoot].includes(resolved) || !resolved.startsWith(root + path.sep)) throw new Error('No se permite limpiar esta ruta: ' + resolved);
  fs.rmSync(resolved, { recursive: true, force: true });
}
const env = { ...process.env, SOS_FAUNA_BUILD_TARGET: preview ? 'local-preview' : 'publication', EXPO_PUBLIC_SOS_FAUNA_STATIC_PREVIEW: preview ? '1' : '0' };
function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
function prepareWebRoutes() {
  removeBuildDirectory(routerRoot);
  fs.mkdirSync(path.dirname(routerRoot), { recursive: true });
  fs.cpSync(path.join(root, 'app'), routerRoot, { recursive: true });
  const pages = { home: 'LandingPage', about: 'AboutPage', sources: 'SourcesPage', contact: 'ContactPage', privacy: 'PrivacyPage', legal: 'LegalPage', guide: 'AvisoRoute', faq: 'FaqPage', swifts: 'TopicFaqPage', bats: 'TopicFaqPage', centers: 'CentrosRoute', history: 'HistoryPage' };
  // History uses the shared page but remains private and outside the sitemap.
  for (const [id, routes] of [...getBilingualRoutes(), ['history', getWebRoutes().history]]) {
    if (!pages[id] || !/^\/en\/(?:[a-z]+(?:\/[a-z]+)*)?$/.test(routes.en)) throw new Error('Ruta inglesa no reconocida: ' + id);
    const file = path.join(routerRoot, routes.en.replace(/^\//, '').replace(/\/$/, '/index') + '.tsx');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const modulePath = id === 'history' ? '@/app/history' : id === 'guide' ? '@/app/aviso' : id === 'centers' ? '@/app/centros' : id === 'faq' ? '@/components/faq/FaqPage' : `@/components/home/${pages[id]}`;
    if (id === 'swifts' || id === 'bats') {
      const topicId = id === 'swifts' ? 'vencejos' : 'murcielagos';
      fs.writeFileSync(file, `import TopicFaqPage from "@/components/faq/TopicFaqPage";\nexport default function TopicRoute() { return <TopicFaqPage topicId="${topicId}" />; }\n`);
    } else fs.writeFileSync(file, `export { default } from "${modulePath}";\n`);
  }
  const layoutFile = path.join(routerRoot, '_layout.tsx');
  const layout = fs.readFileSync(layoutFile, 'utf8');
  if (!layout.includes('</Stack>')) throw new Error('No se reconoce el layout web.');
  fs.writeFileSync(layoutFile, layout.replace('</Stack>', '<Stack.Screen name="en/index" options={{ headerShown: false }} />\n</Stack>'));
  if (preview) {
    const file = path.join(routerRoot, '+html.tsx');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace("if ('serviceWorker' in navigator)", "if (false && 'serviceWorker' in navigator)"));
  }
}
function finishHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) finishHtml(file);
    else if (entry.name.endsWith('.html')) {
      const relative = path.relative(dist, file).split(path.sep).join('/');
      const locale = relative === 'en.html' || relative.startsWith('en/') ? 'en' : 'es';
      const source = fs.readFileSync(file, 'utf8');
      let html = source.replace(/<html\b([^>]*)>/i, (tag, attributes) => /\blang=["'][^"']*["']/i.test(attributes) ? tag.replace(/\blang=["'][^"']*["']/i, `lang="${locale}"`) : `<html lang="${locale}"${attributes}>`);
      // Expo's internal route listing is not the public XML sitemap and must
      // never become an indexable page exposing the application's internal routes.
      if (relative === '_sitemap.html') html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow" /></head>');
      if (html !== source) fs.writeFileSync(file, html);
    }
  }
}
removeBuildDirectory(dist);
if (!preview) {
  removeBuildDirectory(publicDist);
  run(path.join(root, 'scripts', 'write-version-json.js'));
}
prepareWebRoutes();
run(path.join(root, 'node_modules', 'expo', 'bin', 'cli'), ['export', '--platform', 'web', '--output-dir', 'dist', '--clear']);
finishHtml(dist);
const home = path.join(dist, 'en.html'), index = path.join(dist, 'en', 'index.html');
if (fs.existsSync(home)) {
  fs.mkdirSync(path.dirname(index), { recursive: true });
  fs.copyFileSync(home, index);
  fs.unlinkSync(home); // One English home URL, /en/; no duplicate /en.html.
} else if (!fs.existsSync(index)) throw new Error('No se ha exportado la portada inglesa.');
if (preview) {
  fs.writeFileSync(path.join(dist, 'LOCAL_PREVIEW_ONLY.txt'), 'Vista previa local. No publicar esta carpeta.\n');
  console.log('Vista previa local en dist. Utiliza: npx.cmd serve dist -l 3000');
} else {
  run(path.join(root, 'scripts', 'generate-sitemap.js'));
  const workboxPackage = require.resolve('workbox-cli/package.json'), workbox = require(workboxPackage);
  const bin = typeof workbox.bin === 'string' ? workbox.bin : Object.values(workbox.bin)[0];
  run(path.resolve(path.dirname(workboxPackage), bin), ['generateSW', 'workbox-config.js']);
  const notFound = path.join(dist, '+not-found.html');
  if (!fs.existsSync(notFound)) throw new Error('Falta la página 404 exportada.');
  fs.copyFileSync(notFound, path.join(dist, '404.html'));
  fs.writeFileSync(path.join(dist, '.nojekyll'), '');
  fs.cpSync(dist, publicDist, { recursive: true });
  fs.writeFileSync(path.join(publicDist, 'PUBLIC_BUILD.json'), JSON.stringify({ target: 'publication', schemaVersion: 2, locales: ['es', 'en'], englishRoutes: true }) + '\n');
  run(path.join(root, 'scripts', 'assert-public-build.cjs'));
  console.log('Compilación pública bilingüe validada en dist-public.');
}
