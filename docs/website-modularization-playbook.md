# Website Modularization Playbook

This playbook captures the architecture discipline for `molodchyk.com` and other small public websites in this settings workspace. It is adapted from the browser-extension modularization standard, but it respects website constraints: stable public URLs, GitHub Pages deployment, static assets, SEO metadata, localized page copy, and optional third-party form processors.

This is a prescriptive target, not a description of the current repository. Existing broad files are migration inventory. When a current page differs from this playbook, move it toward this shape in small verified steps.

The goal is not decorative folders. The goal is to keep public website work maintainable as it grows: small reviewable modules, obvious page ownership, bounded styles, localized copy that can be audited, and privacy-sensitive surfaces that are hard to accidentally expand.

## Core Principle

Use page-first modules with feature-owned behavior.

Public pages are the stable product surface. They should own routing, metadata, and visible structure. They should not become storage for all copy, all JavaScript, all CSS, and all form logic.

The best default is:

1. group by public page or reusable feature;
2. keep root deployable files thin;
3. move page behavior into nearby JavaScript modules;
4. move shared behavior into narrow feature or platform modules;
5. keep styles either page-owned, feature-owned, or token-level;
6. keep generated or deploy-only output separate from human-authored source when a build step is introduced.

Do not organize a growing website only around root `index.html`, root `site.js`, and one global `styles.css`. That shape is acceptable for an MVP, but it should not be the target once pages, forms, localization, or third-party integrations grow.

## Why This Matters For Codex

Codex tends to follow the shape it finds. If a site has broad files and no ownership map, new work will keep landing in those broad files.

A website modularization playbook gives Codex an architectural gravity field:

- new behavior goes to the narrowest existing page or feature owner;
- broad root files become compatibility entries, not permanent dumping grounds;
- page-specific copy, form logic, and styles stay near the page they serve;
- URL parameters and third-party endpoints stay behind small audited helpers;
- localization additions do not inflate HTML files indefinitely;
- file-size and folder-density audits detect structural decay early.

## Recommended Source Shape

A mature static website should move toward this shape. A no-build GitHub Pages site can keep deployable page folders at the root while still using the same ownership rules.

```text
index.html
CNAME
.nojekyll

assets/
  images/
  icons/

styles/
  tokens.css
  base.css
  layout.css

scripts/
  app/
    index.js
    language.js
    theme.js
  platform/
    dom.js
    storage.js
    urlParams.js
    fetchJson.js
  features/
    github-repos/
      githubApi.js
      repoCard.js
      repoModel.js
      repoModel.test.js
      repoCard.css

pages/
  home/
    copy.js
    sections.js
    home.css

youtube-mix-blocker/
  uninstall/
    index.html
    uninstall.js
    params.js
    params.test.js
    form.js
    copy/
      en.js
      ar.js
      pt-BR.js
    uninstall.css

docs/
  website-modularization-playbook.md
```

This is a target shape. The current repository can migrate gradually. Do not introduce a framework or build step only to satisfy the tree; introduce one only when it reduces real complexity.

## No-Build Static Site Rules

GitHub Pages static hosting is a valid architecture.

Rules:

- Root `index.html` may stay as the public home page.
- Public utility paths such as `youtube-mix-blocker/uninstall/` may stay as root folders because the URL is the contract.
- Inline JavaScript should be limited to tiny pre-paint or bootstrap snippets.
- Page-specific scripts should live in a sibling or nearby `.js` file once they exceed the inline budget.
- Page-specific styles should live in a page stylesheet once they exceed the inline budget.
- Shared helpers should move into `scripts/platform/` or `scripts/features/`, not into a broad `utils.js`.
- If a build step is added later, generated output belongs in `_site/`, `dist/`, or another ignored output folder, not mixed with source.

## Page Ownership Rules

Every meaningful public surface should have one owning page folder or page module.

Examples:

- The home page owns first-viewport copy, project sections, now/about/contact sections, and page metadata.
- The GitHub repository cards feature owns public GitHub API fetches, repository normalization, fallback repositories, card rendering, and related styles.
- The YouTube Mix Blocker uninstall page owns feedback form copy, query parameter normalization, Formspree submission behavior, and form-specific styles.

Avoid:

- adding every new interaction to root `site.js`;
- adding every new visual rule to root `styles.css`;
- storing large localized copy blocks inside an HTML file;
- hiding URL parameter parsing inside form rendering code;
- putting unrelated helpers into `utils.js`;
- mixing public content changes with broad path moves.

## HTML Entry Rules

HTML files are public page contracts.

Rules:

- HTML should own semantic structure, metadata, and script/style references.
- HTML should not contain large translation dictionaries or complex behavior.
- Inline script over 60 lines should be extracted.
- Inline style over 120 lines should be extracted.
- If a page exceeds 350 lines, check whether copy, behavior, or style can move to page-owned files.
- If a page exceeds 700 lines, create a split plan unless there is a clear temporary reason.
- If a page exceeds 1000 lines, treat it as architecture debt.

Stable URLs matter. Do not rename or move public page folders without a redirect or an explicit release note.

## JavaScript Structure

Author JavaScript as small modules when the site grows beyond one page.

Best target:

- Page entry files initialize modules and wire events.
- Feature modules own reusable behavior.
- Platform modules own browser APIs such as `localStorage`, `fetch`, URL parsing, and DOM helpers.
- Pure helpers do not touch `window`, `document`, network, storage, or time unless injected.

Suggested ownership:

- `scripts/platform/urlParams.js` owns query parameter normalization.
- `scripts/platform/storage.js` owns localStorage reads and failure handling.
- `scripts/platform/dom.js` owns safe element lookup and text updates.
- `scripts/features/github-repos/` owns public repository card behavior.
- `youtube-mix-blocker/uninstall/params.js` owns uninstall query parameter policy.
- `youtube-mix-blocker/uninstall/copy/` owns page-local translations.

Avoid:

- `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`, and string-based timers for new work;
- unbounded parsing of URL parameters;
- authenticated API calls from public frontend code;
- remote executable scripts unless a documented privacy and security review approves them.

## CSS Structure

Use layered styles with narrow ownership.

Preferred layers:

1. token styles for colors, spacing, typography, and shadows;
2. base styles for reset and body-level behavior;
3. layout styles for shared page scaffolding;
4. feature or page styles for concrete surfaces;
5. tiny one-off rules only when they will not grow.

Rules:

- Root `styles.css` should become a compatibility entry or shared layer, not the only stylesheet forever.
- Page styles belong near the page when they change only that page.
- Feature styles belong near the feature when they change with that feature.
- Avoid one huge stylesheet where unrelated pages compete for selectors.
- Keep selectors explicit and shallow. If selectors need page-specific exceptions, move the styles closer to the page.

## Localization Structure

Localization should not make pages unreviewable.

Rules:

- Keep form field names, endpoint URLs, and hidden machine values stable across locales.
- Page-visible copy can live in a page-owned `copy/` folder when locale count grows.
- Large translation maps should be split by page and, when needed, by locale.
- Locale aliases and canonicalization should live in one page-owned helper.
- Right-to-left languages must be checked on the actual page surface.
- Metadata title and description should be localized with the visible page copy.

For the uninstall page, translations are page-owned because they describe a specific feedback workflow. They should not move into root site language data unless the same strings are reused elsewhere.

## Privacy And Integration Boundaries

Public websites often look harmless because they are static. They still ship browser code to users.

Rules:

- Treat URL parameters, localStorage, GitHub API responses, and form input as untrusted.
- Keep third-party form endpoints in literal reviewed constants.
- Do not build `action`, `href`, `src`, redirects, or API URLs from unconstrained user input.
- Keep analytics, trackers, ad pixels, and session replay out unless the user explicitly asks and the privacy documentation changes first.
- Keep public GitHub API use unauthenticated unless there is a deliberate backend design.
- Do not send extension user IDs, install IDs, browser history, YouTube URLs, settings, counters, or page content to website forms.

## File Size Budgets

These are maintainability budgets, not hosting requirements.

Suggested targets:

- HTML page file: under 350 lines.
- Tiny inline script: under 60 lines.
- Tiny inline style: under 120 lines.
- Page JavaScript entry: under 150 lines.
- Pure JavaScript module: 100 to 300 lines.
- UI rendering module: 150 to 350 lines.
- Page stylesheet: under 450 lines.
- Feature stylesheet: under 300 lines.
- Locale copy file: under 500 lines.
- Test file: under 500 lines.
- Markdown doc: under 500 lines unless it is a reference document.

Escalation:

- Over 500 lines: check whether the file has more than one owner.
- Over 700 lines: create a follow-up split unless there is a clear reason.
- Over 1000 lines: treat as architecture debt.

Binary assets must be excluded from line-count audits. Audit image dimensions, size, and metadata separately.

## Folder Density Budgets

Flat folders become hard to scan even when every file is small.

Suggested targets:

- Repository root: 15 files or fewer before introducing page, script, style, or asset folders.
- `docs/`: 12 files or fewer per flat level before splitting by topic.
- `assets/`: 20 files or fewer per flat level before splitting into `images`, `icons`, `screenshots`, or `downloads`.
- Page folder: 12 files or fewer before splitting into `copy`, `styles`, `tests`, or helpers.
- Feature folder: 15 files or fewer.
- `scripts/platform/`: 12 files or fewer before splitting by browser, network, DOM, storage, or forms.

Folder-density audits catch the "everything goes here" failure before individual files become huge.

## Co-Location Rule

Put files near the thing they serve.

Prefer:

```text
youtube-mix-blocker/
  uninstall/
    index.html
    uninstall.js
    params.js
    params.test.js
    copy/
      en.js
      de.js
      ar.js
    uninstall.css
```

Over:

```text
index.html
site.js
styles.css
translations.js
utils.js
```

Co-location is especially important for utility pages connected to an extension release, because privacy wording, URL parameters, form fields, and translations need to be reviewed together.

## Migration Strategy

Do not do a giant rename-only refactor.

Preferred migration:

1. Add guardrail docs and audits.
2. Add narrow behavior checks around current behavior.
3. Extract one responsibility into a page-owned or feature-owned file.
4. Keep the public URL unchanged.
5. Update only the script/style references that are necessary.
6. Run narrow local checks.
7. Push and verify the live GitHub Pages URL when deployment is involved.
8. Repeat.

Good refactor commits say what responsibility moved:

- `Split uninstall query parameter handling`
- `Move GitHub repository cards into feature module`
- `Extract homepage language copy`

Weak commit messages hide risk:

- `Refactor`
- `Cleanup`
- `Move stuff`

## Current Migration Inventory

The current site has a few broad MVP files. Treat these as inventory to improve when touched:

- `youtube-mix-blocker/uninstall/index.html` combines page HTML, styles, translations, parameter handling, and form behavior.
- `styles.css` is a broad global stylesheet.
- `site.js` combines language switching, theme behavior, public GitHub API behavior, and fallback data.

Do not expand these files just because they already exist. For new work, create the narrow owner first.

## Required Checks By Change Type

For page or URL changes:

- check that `.github/workflows/pages.yml` copies the deployed path;
- verify the live URL returns `200` after deployment;
- verify canonical, title, description, and noindex/index intent.

For form changes:

- validate URL parameter normalization;
- submit a non-sensitive test payload when the form shape or endpoint changes;
- keep field names stable unless there is a migration reason;
- verify privacy copy mentions the third-party processor.

For localization changes:

- check every locale has the same visible copy keys;
- check metadata title and description;
- check right-to-left locales on the actual page;
- keep locale aliases in one helper.

For CSS or layout changes:

- check desktop and mobile widths;
- check that text does not overlap or overflow controls;
- check that page-specific selectors did not leak into unrelated pages.

For file or folder structure changes:

- run a file-size audit excluding binary assets;
- run a folder-density audit;
- update this document or README if ownership changes.

## Portable Audit Commands

These commands are intentionally simple and can be turned into package scripts later.

File-size audit excluding common binary assets:

```powershell
rg --files -g '!assets/**/*.png' -g '!assets/**/*.webp' -g '!assets/**/*.jpg' -g '!assets/**/*.jpeg' -g '!assets/**/*.gif' -g '!assets/**/*.ico' -g '!assets/**/*.pdf' -g '!assets/**/*.zip' |
  ForEach-Object {
    $lines = (Get-Content -LiteralPath $_ | Measure-Object -Line).Lines
    [PSCustomObject]@{ Lines = $lines; Path = $_ }
  } |
  Sort-Object Lines -Descending
```

Folder-density audit:

```powershell
Get-ChildItem -Recurse -Directory |
  ForEach-Object {
    $files = @(Get-ChildItem -LiteralPath $_.FullName -File)
    [PSCustomObject]@{ Files = $files.Count; Path = $_.FullName }
  } |
  Sort-Object Files -Descending
```

Inline script syntax check for simple static HTML:

```powershell
node -e "const fs=require('fs'),vm=require('vm'); for (const file of process.argv.slice(1)) { const html=fs.readFileSync(file,'utf8'); [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m,i)=>new vm.Script(m[1],{filename:file+':inline-'+(i+1)})); }" youtube-mix-blocker/uninstall/index.html
```

## Website-Specific Constraints

Websites have constraints that are different from browser extensions:

- Public URLs are contracts.
- SEO and social metadata are part of the shipped page.
- GitHub Pages deployment copies only what the workflow prepares.
- Static frontend code cannot hide secrets.
- Form endpoints are public even when submissions are private.
- Browser cache can preserve old CSS and JavaScript, so version query strings may be needed for asset changes.
- Images can leak metadata, location clues, reflections, screens, and private context.
- Docs in the repo are public even when they are not deployed.

Any modularization plan that ignores these constraints is cosmetic.

## Anti-Patterns

Avoid:

- one giant `index.html`;
- one giant `site.js`;
- one giant `styles.css`;
- translations embedded in the same HTML file forever;
- all assets in a flat `assets/` folder;
- broad `utils.js` modules;
- public docs that include private local paths, schedules, or decision context;
- inline scripts that parse URL parameters and submit forms without tests;
- path moves mixed with visible behavior changes;
- unreviewed generated output.

## Healthy End State

A healthy website codebase has:

- page-owned modules;
- feature-owned reusable behavior;
- thin HTML entries;
- small, testable URL and form helpers;
- localized copy that can be audited by page and locale;
- bounded global styles;
- page or feature styles near the surface they serve;
- public docs that are safe to publish;
- explicit GitHub Pages deployment paths;
- file-size and folder-density audits;
- architecture docs that match the current tree.

This makes future Codex work cheaper: the next change has an obvious home, a local verification path, and a clear set of checks.
