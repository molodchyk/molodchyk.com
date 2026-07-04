# molodchyk.com

Public personal website for Oleksandr Molodchyk.

The site is a compact home base for current software work: practical browser tools, local-first systems, and public project activity. It is intentionally static, small, and privacy-conservative.

Live site: https://molodchyk.com

## Public Source

This repository is the public source for `molodchyk.com`. It may host small project-specific pages, but it is not the source tree for every project linked from the site.

Browser extension code is kept in separate repositories, for example:

- MotionBlock: https://github.com/molodchyk/MotionBlock
- YouTube Mix Blocker: https://github.com/molodchyk/YouTubeMixBlocker

The website and browser extensions are separate projects with separate release surfaces.

## What This Contains

- A localized homepage with project cards, current-focus copy, contact links, and public GitHub repository cards.
- A MotionBlock uninstall feedback page at `/motionblock/uninstall/`.
- A YouTube Mix Blocker uninstall feedback page at `/youtube-mix-blocker/uninstall/`.
- Static assets and no-build JavaScript/CSS modules.
- Public architecture and maintenance notes in `docs/`.

## Architecture

This is a no-build GitHub Pages site. Source files are served directly.

- `index.html` is the public homepage entry.
- `site.js` is a thin ES module entry for the homepage.
- `styles.css` is a thin CSS entry that imports shared and page-owned styles.
- `pages/home/` owns homepage copy, initialization, and page-specific styles.
- `scripts/app/` owns shared page behavior such as language and theme switching.
- `scripts/features/github-repos/` owns public GitHub repository loading and rendering.
- `scripts/platform/` owns small browser/platform helpers.
- `motionblock/uninstall/` owns the MotionBlock uninstall feedback page, its localized copy, query-parameter normalization, form field wiring, and page-specific styles.
- `youtube-mix-blocker/uninstall/` owns the YouTube Mix Blocker uninstall feedback page, its localized copy, query-parameter normalization, form field wiring, and page-specific styles.
- `docs/website-modularization-playbook.md` defines the target structure, file-size budgets, folder-density budgets, and migration rules.

The public URL structure is part of the contract. Do not move deployed paths without updating the GitHub Pages workflow and verifying the live route.

## Feedback Form Provider

The uninstall feedback forms are sent to Formspree:

```text
MotionBlock: https://formspree.io/f/mdaryvjp
YouTube Mix Blocker: https://formspree.io/f/xykqwgqe
```

The form actions are defined in `motionblock/uninstall/index.html` and `youtube-mix-blocker/uninstall/index.html`.

## Privacy Boundaries

The main site:

- uses the public GitHub API in the browser without a token;
- has no backend, database, serverless function, or authenticated API call;
- does not use analytics, ads, trackers, session replay, or remote executable scripts;
- stores only local UI preferences such as language and theme in browser storage.

The uninstall feedback pages:

- posts optional feedback to the project-specific Formspree endpoint;
- accepts only generic `source`, `version`, and `lang` query parameters;
- normalizes submitted hidden fields before sending them;
- stores the first sanitized uninstall metadata in `sessionStorage` so a reload without query parameters keeps the original `source`, `version`, and language for that tab/session;
- do not include extension user IDs, install IDs, browsing history, page URLs, settings, counters, diagnostics, or page content.

Submitted feedback is user data and should be treated as private even though the Formspree endpoint is visible in the public source.

## Localization

The homepage currently supports English, German, and Ukrainian.

The uninstall feedback pages support the same 66 Chrome Web Store visible locales as the Chrome extensions. English regional variants use the English base copy, and compatible browser language tags such as `es_419`, `pt`, and Chinese script or region variants are mapped through locale aliases. Right-to-left layout is enabled for Arabic, Persian, Hebrew, and Urdu.

Keep machine field names, endpoint URLs, and hidden form semantics stable across locales so feedback remains analyzable.

## Local Checks

Run the compliance checks before publishing:

```powershell
npm run check
git diff --check
rg -n -i "password|secret|token|api[_-]?key|client[_-]?secret|private[_-]?key|bearer |authorization|REPLACE_WITH|TODO|FIXME" .
```

`npm run check` validates:

- inline script syntax;
- local module, stylesheet, and deployed asset references;
- homepage and uninstall locale key parity;
- Formspree field-name stability;
- uninstall query-parameter normalization;
- file-size budgets;
- folder-density budgets.

## Deployment

GitHub Pages deploys from `.github/workflows/pages.yml` on pushes to `main`.

The workflow prepares `_site/` manually. If a new deployed top-level folder is added, the workflow must copy it explicitly.

After pushing a site change, verify:

- `https://molodchyk.com/`
- `https://molodchyk.com/motionblock/uninstall/?source=chrome&version=1.0.1&lang=en`
- `https://molodchyk.com/youtube-mix-blocker/uninstall/?source=chrome&version=1.5.4&lang=en`

## Public Repo Hygiene

Everything in this repository is public, including files that are not deployed.

Do not commit secrets, private planning notes, raw exports, personal schedules, screenshots with sensitive browser chrome, local machine paths, or image metadata that exposes private context.
