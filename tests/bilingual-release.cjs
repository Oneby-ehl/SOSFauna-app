// Release checks reuse the immutable 2G inputs, outputs and actual protocol evaluator.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const fixtureFile = path.join(__dirname, 'fixtures/protocols-before-i18n-2g.json');
const bytes = fs.readFileSync(fixtureFile);
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), '8dde12dc68da520dd7db874c21be707bc41609d3fd995b8435bd5d0e4bec18e0');
const reference = JSON.parse(bytes).recommendations;
// Import the original evaluator without running its obsolete "English must be gated"
// phase assertions or rewriting any historical test, fixture or hash reference.
const historicalFile = path.join(__dirname, 'i18n-assistant.cjs');
const evaluator = new Module(historicalFile, module);
evaluator.filename = historicalFile;
evaluator.paths = Module._nodeModulePaths(__dirname);
evaluator._compile(fs.readFileSync(historicalFile, 'utf8') + '\nmodule.exports.releaseProtocols = protocols; module.exports.releaseFlagKeys = flagKeys;\n', historicalFile);
const protocols = evaluator.exports.releaseProtocols;
assert.equal(JSON.stringify(evaluator.exports.releaseFlagKeys), JSON.stringify(reference.flagKeys));
assert.equal(reference.cases.length, 28394);
for (const [state, animal, mask, position, environment, index] of reference.cases) {
  const flags = Object.fromEntries(reference.flagKeys.map((key, bit) => [key, Boolean(mask & (1 << bit))]));
  const expected = reference.outputs[index];
  assert.equal(protocols.getAdvice(state, animal, flags, position, environment), expected, JSON.stringify([state, animal, mask, position, environment]));
  assert.equal(protocols.getAdviceForLocale('es', state, animal, flags, position, environment), expected);
}
const load = evaluator.exports.load;
const selection = load('i18n/selection.ts');
assert.equal(load('i18n/effectiveLocale.ts').getEffectiveLocale('en', 'native'), 'es');
for (const [languages, preference, url, expected] of [
  [['es-MX'], null, '/', null], [['en-US'], null, '/', '/en/'], [['fr-FR'], null, '/', '/en/'],
  [['fr-FR', 'es-ES'], null, '/', null], [['en-GB'], 'es', '/', null], [['es-ES'], 'en', '/', '/en/'],
  [['es-ES'], null, '/en/faq', null], [['en-US'], null, '/about', null], [['en-US'], null, '/?case=1', null],
]) {
  let replaced = null;
  const document = { documentElement: { style: {}, dataset: {} } };
  vm.runInNewContext(selection.initialLanguageScript, { navigator: { languages, language: languages[0] }, localStorage: { getItem: () => preference }, document, location: { pathname: url.split('?')[0], search: url.includes('?') ? '?case=1' : '', hash: '', replace: target => replaced = target }, setTimeout: () => {} });
  assert.equal(replaced, expected, 'Initial head redirect: ' + JSON.stringify([languages, preference, url]));
  assert.equal(document.documentElement.style.visibility === 'hidden', Boolean(expected));
}
assert.equal(load('i18n/catalogs/home.en.ts').homeEn.navigation.continueCase, 'Continue previous report');
const selector = fs.readFileSync(path.join(root, 'components/i18n/LanguageSelector.tsx'), 'utf8');
assert(!selector.includes('backgroundColor') && !selector.includes('borderWidth'));
assert(selector.includes('fontWeight: "700"'));
const rejectionDir = path.resolve(root, '.expo', 'bilingual-artifact-rejection');
assert(rejectionDir.startsWith(path.resolve(root, '.expo') + path.sep));
fs.mkdirSync(rejectionDir, { recursive: true });
try {
  const { validate } = require('../scripts/assert-public-build.cjs');
  const writeMarker = marker => fs.writeFileSync(path.join(rejectionDir, 'PUBLIC_BUILD.json'), JSON.stringify(marker));
  writeMarker({ target: 'local-preview', englishRoutes: true });
  assert.throws(() => validate(rejectionDir), /marcador/);
  writeMarker({ target: 'publication', schemaVersion: 2, englishRoutes: true, locales: ['es', 'en'] });
  fs.writeFileSync(path.join(rejectionDir, 'LOCAL_PREVIEW_ONLY.txt'), 'preview');
  assert.throws(() => validate(rejectionDir), /vista previa/);
  fs.unlinkSync(path.join(rejectionDir, 'LOCAL_PREVIEW_ONLY.txt'));
  assert.throws(() => validate(rejectionDir), /Falta sw.js/);
} finally {
  fs.rmSync(rejectionDir, { recursive: true, force: true });
}
console.log('PASS: 28,394 exact Spanish cases and immutable SHA-256; native locale remains Spanish; initial language/preference/deep-link/no-flash cases; selector and Continue previous report preserved.');
