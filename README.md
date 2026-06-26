# molodchyk.com

Personal brand website for Oleksandr Molodchyk.

## Original Idea

> create personal brand website molodchyk.com "I love building things" photo of me working at desk, either the live calendar integration of what I do or github integration, and localise it

## Product Direction

This should be a personal site, not a generic portfolio template.

First impression:

- a real photo of me working at a desk
- the line: "I love building things"
- current projects and work in progress
- GitHub activity or a carefully sanitized current-focus feed
- localized content

## First Version

The first version should probably prioritize GitHub/project integration over live calendar integration. Calendar data can accidentally expose schedule, availability, locations, meeting names, and personal routines. If a calendar-like section exists, it should publish only manually approved or sanitized information.

## Planned Sections

- Home
- Projects
- Now
- About
- Contact

## Related Projects

- Defense Against Distractions
- Defense Against Distractions Windows

## Current Implementation

The first site slice is static and GitHub Pages-compatible:

- `index.html` remains the public homepage URL and owns the semantic page structure.
- `site.js` is a thin ES module entry that initializes `pages/home/`.
- `styles.css` is a thin CSS entry that imports shared styles and homepage styles.
- `scripts/` contains shared app, platform, feature, and validation modules.
- `pages/home/` owns homepage copy, initialization, and page-specific styles.
- `youtube-mix-blocker/uninstall/` owns the optional YouTube Mix Blocker uninstall feedback page, including page-specific styles, localized copy, query-parameter normalization, and Formspree field wiring.
- `assets/hero-workspace.png` is a temporary generated workspace image. Replace it with a real desk photo when available.
- `docs/website-modularization-playbook.md` records the target architecture, file-size budgets, folder-density budgets, and migration rules for keeping the site maintainable as it grows.

There is no backend, no serverless function, no database, and no usage-metered runtime surface.

The main site uses the public GitHub API in the browser with no token and no backend. It does not use analytics, ads, tracking scripts, session replay, or authenticated API calls.

The YouTube Mix Blocker uninstall page is static and posts to Formspree through `https://formspree.io/f/xykqwgqe`. It localizes visible form copy from the `lang` query parameter for the measured uninstall languages plus ten additional likely Chrome locales: `ar`, `ca`, `cs`, `de`, `es`, `fr`, `hr`, `id`, `ko`, `pl`, `pt_BR`, `pt_PT`, `ru`, `sv`, `tr`, `vi`, `zh_TW`, `zh_CN`, `fil`, `hi`, `it`, `ja`, `ms`, `nl`, `ro`, `th`, and `uk`, with English fallback and aliases for `en_US`, `en_GB`, and `es_419`.

The uninstall page only accepts generic `source`, `version`, and `lang` query parameters. Submitted hidden fields are normalized before they are sent to Formspree; no extension user IDs, install IDs, browser history, YouTube URLs, settings, counters, or page content are included.

## Checks

Run the local compliance checks before publishing:

```powershell
npm run check
git diff --check
rg -n -i "password|secret|token|api[_-]?key|client[_-]?secret|private[_-]?key|bearer |authorization|REPLACE_WITH|TODO|FIXME" .
```

The `npm run check` script validates inline scripts, local imports and deployed asset references, locale key parity, uninstall query-parameter behavior, file-size budgets, and folder-density budgets.

## Status

Static MVP implemented and deployable through GitHub Pages. The current no-build module layout follows `docs/website-modularization-playbook.md` while preserving public URLs.
