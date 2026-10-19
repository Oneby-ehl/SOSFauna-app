# FAQ SEO phase 1 — local validation

No test sends requests outside its temporary localhost server. Browser contexts and
saved rescue cases are isolated from the user's browser and real application data.

## References captured before the application changes

- fixtures/faq-before-seo.json: 49 query/interaction scenarios, actual FaqPage
  computation, engine candidates/results, suggestions, category order, adapted
  introductory text, full FAQ/catalog data and hashes of protected sources.
- fixtures/faq-browser-before-seo.json: the same 49 scenarios against the original
  pre-change dist, captured in a real Chromium browser.

The capture commands refuse to overwrite these references. Do not regenerate them
to make a failing regression pass.

faq-regression.cjs transpiles the local TypeScript in memory. It replaces only the
component's final JSX return in memory to observe its existing calculations. The
search, species rules, priorities, grouping and advice functions are executed from
the actual source; no alternate implementation is used. Browser tests also compare
the observed question order and suggestions with those source snapshots.

## Run

From the repository root, with existing node_modules:

    node tests/faq-regression.cjs
    node node_modules/typescript/bin/tsc --noEmit --incremental false

Export without remote operations or changing public/version.json (PowerShell):

    $env:EXPO_OFFLINE = '1'
    $env:EXPO_NO_TELEMETRY = '1'
    $env:CI = '1'
    $env:npm_config_offline = 'true'
    node node_modules/expo/bin/cli export --platform web
    node scripts/generate-sitemap.js
    node node_modules/workbox-cli/build/bin.js generateSW workbox-config.js

Check each command's exit code before continuing.

Browser tests use an already available Playwright package and an installed Chrome
or Edge. No browser or package is downloaded. Set SOS_FAUNA_PLAYWRIGHT to the local
Playwright package directory if it is not resolvable from node_modules. Optionally
set SOS_FAUNA_BROWSER to a local Chromium executable.

    node tests/faq-browser.cjs
    node tests/faq-seo.cjs
    node tests/rescue-flows.cjs

- faq-browser: exact original FAQ visible order, suggestions and expanded state.
- faq-seo: all 54/6 static answers, native accordions without JavaScript, hydration,
  eleven queries per topic, headings, metadata, schema/content parity, crawlable
  links, sitemap, internal noindex, four responsive widths, JS size and offline PWA.
- rescue-flows: saved-case preservation, continuation/recovery, history, cancel and
  confirm starting a new case. The existing assistant manages browser history, so
  the new-case assertion checks the active screen rather than a transient URL.

Screenshots are written only under ignored .expo/seo-checks.

The local static server models extensionless HTML routes; it does not validate
production hosting redirects, Google indexing, field Core Web Vitals, TalkBack/
VoiceOver, or an Android device. The 50 KB JS growth assertion is a regression
alarm, not a claim about field performance or a universal performance budget.
