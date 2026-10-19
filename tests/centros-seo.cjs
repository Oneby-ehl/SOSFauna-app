const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');
const { withBrowser } = require('./browser-local.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const reference = JSON.parse(read('tests/fixtures/centros-before-seo.json'));
const modules = new Map();
function evaluate(source, name) {
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext('(function(exports,require){' + output + '\n})', {}, { filename: name })(exports, specifier => load(specifier.slice(2) + '.ts'));
  return exports;
}
function load(name) {
  if (!modules.has(name)) modules.set(name, evaluate(read(name), name));
  return modules.get(name);
}
const contentFile = 'components/contacts/RecoveryCentersPage.tsx';
const ast = ts.createSourceFile(contentFile, read(contentFile), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declarations = ast.statements.filter(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(d => ['getProvinceHelpGroups', 'normalizeProvinceSearch'].includes(d.name.getText(ast))));
const helpers = evaluate('import { getRecoveryCenterProvinceContacts } from "@/data/helpContacts";\nimport { marineHelpContacts } from "@/data/marineHelpContacts";\n' + declarations.map(n => n.getText(ast)).join('\n') + '\nexport { normalizeProvinceSearch };', 'groups.ts');
const groups = JSON.parse(JSON.stringify(helpers.getProvinceHelpGroups()));
assert.equal(ast.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === 'RecoveryCentersContent').getText(ast), reference.sharedContent, 'Shared assistant component changed');
for (const [file, digest] of Object.entries(reference.protected)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'), digest, 'Protected file changed: ' + file);
for (const name of ['sitemap.xml','robots.txt']) {
  const original = Buffer.from(name === 'sitemap.xml' ? reference.sitemap : reference.robots);
  const destination = path.join(root,'dist',name);
  // Export may remove generated ancillary files; keep the existing contents unchanged.
  if (!fs.existsSync(destination)) fs.writeFileSync(destination, original);
  assert(original.equals(fs.readFileSync(destination)), name + ' changed');
}
const bytes = fs.readFileSync(path.join(root,'dist/centros.html'));
const sizes = { before: reference.bytes, after: bytes.length, increase: bytes.length-reference.bytes, beforeGzip: reference.gzip, afterGzip: zlib.gzipSync(bytes).length };
const total = groups.reduce((n,g) => n+g.terrestrialContacts.length+g.marineContacts.length,0);
console.log('Protected component and files unchanged. HTML sizes: ' + JSON.stringify(sizes));
fs.mkdirSync(path.join(root,'.expo/centros-checks'),{recursive:true});
withBrowser(async ({origin,newContext}) => {
  const errors=[];
  const checkContacts = async page => {
    const observed = await page.locator('.centros-province').evaluateAll(nodes => nodes.map(node => ({province:node.dataset.province, contacts:[...node.querySelectorAll('.centros-group li')].map(row => ({name:row.querySelector('.centros-contact-name').textContent,note:row.querySelector('.centros-contact-note').textContent,phone:row.querySelector('a')?.getAttribute('href') || null}))})));
    assert.equal(observed.length, groups.length);
    for (const [index,group] of groups.entries()) {
      const expected = [...group.terrestrialContacts,...group.marineContacts].map(c => ({name:c.name,note:c.note,phone:c.phone?'tel:'+c.phone.replace(/\s/g,''):null}));
      assert.deepEqual(observed[index], {province:group.province,contacts:expected});
      assert.equal(new Set(expected.map(c=>JSON.stringify(c))).size, expected.length, 'Duplicate in '+group.province);
    }
    return observed;
  };
  const staticContext=await newContext({javaScriptEnabled:false});
  const staticPage=await staticContext.newPage();
  await staticPage.goto(origin+'/centros');
  const staticContacts=await checkContacts(staticPage);
  assert.equal(await staticPage.locator('.public-centros details[open]').count(),0);
  await staticPage.locator('.centros-directory > summary').focus();await staticPage.keyboard.press('Enter');
  const madrid=staticPage.locator('.centros-province[data-province="Madrid"]');
  await madrid.locator('summary').focus();await staticPage.keyboard.press('Enter');assert.equal(await madrid.getAttribute('open'),'');
  assert(await madrid.locator('a[href="tel:627461457"]').isVisible());
  await staticPage.keyboard.press('Space');assert.equal(await madrid.getAttribute('open'),null);
  assert.equal(await staticPage.locator('h1').count(),1);
  await staticContext.close();
  const context=await newContext();const page=await context.newPage();
  page.on('pageerror',e=>errors.push(page.url()+': '+e.message));
  page.on('console',m=>{if(m.type()==='error' && /hydrati|did not match|Minified React error/i.test(m.text()))errors.push(page.url()+': '+m.text());});
  await page.goto(origin+'/centros');
  await page.waitForFunction(()=>Object.keys(document.querySelector('#centros-province-search')).some(k=>k.startsWith('__reactProps')));
  assert.deepEqual(await checkContacts(page),staticContacts,'Hydration changed contact data');
  await page.locator('.centros-directory > summary').click();
  const input=page.getByRole('searchbox',{name:'Buscar provincia',exact:true});
  for(const query of ['ÁVILA','avila','  Ávila  ','MALAGA','málaga','A CORUÑA','coruna','Madrid','mallorca','ibiza','menorca','formentera','ningunaprovincia']) {
    await input.fill(query);
    const expected=groups.filter(g=>helpers.normalizeProvinceSearch(g.province).includes(helpers.normalizeProvinceSearch(query))).map(g=>g.province);
    await page.waitForFunction(expected=>JSON.stringify([...document.querySelectorAll('.centros-province:not([hidden])')].map(n=>n.dataset.province))===JSON.stringify(expected),expected);
    assert.equal(await page.locator('.centros-province').count(),groups.length,'Filter unmounted groups');
    assert.equal(await page.locator('.centros-group li').count(),total,'Filter unmounted contacts');
  }
  await input.fill('');
  await page.waitForFunction(()=>![...document.querySelectorAll('.centros-province')].some(n=>n.hidden));
  await input.focus();await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY');
  await page.keyboard.press('Enter');assert.equal(await page.locator('.centros-province[open]').count(),1);
  await page.keyboard.press('Space');assert.equal(await page.locator('.centros-province[open]').count(),0);
  await page.locator('.centros-province[data-province="Madrid"] > summary').click();
  await page.locator('.centros-province[data-province="Mallorca"] > summary').click();
  assert.equal(await page.locator('.centros-province[open]').count(),2);
  for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:844});assert(await page.locator('.public-centros').evaluate(root=>[root,...root.querySelectorAll('*')].every(node=>{const r=node.getBoundingClientRect();return !r.width || (r.left>=0 && r.right<=innerWidth+1);})), 'Directory overflow '+width);}
  await page.screenshot({path:path.join(root,'.expo/centros-checks/desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(root,'.expo/centros-checks/mobile.png'),fullPage:true});
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://sosfauna.es/centros');
  assert.equal(await page.locator('.centros-national a[href^="tel:"]').count(),4);
  assert.deepEqual(errors,[], 'Public page hydration errors');
  console.log(`PASS: ${groups.length} territories, ${total} provincial contacts in static HTML; hydration, 13 filter queries, no-JS, keyboard, phones and four widths.`);
  // Resume an existing case and exercise only the shared help interface.
  const flags=Object.fromEntries(['bleeding','baby','catDog','canNotMove','roadRisk','ringGps','trapped','cannotFly','weakness','normalAppearance','breathing','stranded','fishingLineHook','moreAnimals','peopleDogsNearby','restingOnLand','other'].map(k=>[k,false]));
  const seed={id:'centros-regression-local',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),completedAt:null,step:4,animalState:'alive',animalType:'smallBird',animalPlace:null,animalPosition:null,animalEnvironment:null,flags,locationText:'Prueba local',coords:{latitude:40.4,longitude:-3.7},locationCaptured:true};
  await page.evaluate(seed=>localStorage.setItem('@sos-fauna/current-case',JSON.stringify(seed)),seed);
  await page.goto(origin+'/');
  await page.getByText('Continuar aviso anterior',{exact:true}).click();
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByText('Ayuda',{exact:true}).first().click();
  await page.getByText('📍 Buscar ayuda en mi provincia',{exact:true}).click();
  const assistantSearch=page.getByPlaceholder('Buscar provincia');await assistantSearch.fill('madrid');
  await page.getByText('Madrid',{exact:true}).click();
  assert(await page.getByText('GREFA guardia',{exact:true}).isVisible());
  assert(await page.getByText('627 461 457',{exact:true}).isVisible());
  assert.equal(await page.locator('.public-centros').count(),0,'New interface leaked into assistant');
  assert.equal(await page.locator('details').count(),0);
  await page.getByRole('button',{name:'Volver',exact:true}).click();
  await assistantSearch.waitFor();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('@sos-fauna/current-case')).id),seed.id);
  assert.deepEqual(errors,[],'Browser errors');
  console.log('PASS: resumed guide, original help selector, province filter, Madrid contacts, back navigation and saved case retained.');
  await context.close();
}).catch(error=>{console.error(error);process.exitCode=1;});
