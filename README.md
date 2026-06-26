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

- `index.html` owns the content structure.
- `youtube-mix-blocker/uninstall/index.html` owns the optional YouTube Mix Blocker uninstall feedback page.
- `styles.css` owns the responsive visual system.
- `site.js` owns language switching, UI mode switching, and public GitHub repository cards.
- `assets/hero-workspace.png` is a temporary generated workspace image. Replace it with a real desk photo when available.

There is no backend, no serverless function, no database, and no usage-metered runtime surface.

The YouTube Mix Blocker uninstall page is static and posts to Formspree through `https://formspree.io/f/xykqwgqe`.

## Status

Static MVP implemented and deployable through GitHub Pages.
