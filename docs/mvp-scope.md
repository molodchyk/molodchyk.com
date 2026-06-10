# MVP Scope

## Goal

Create a personal website that immediately communicates:

> I love building things.

The site should make current work visible without becoming a noisy resume or generic portfolio.

## MVP Pages

1. Home
2. Projects
3. Now
4. About
5. Contact

## Home

The first viewport should contain:

- a real photo of Oleksandr working at a desk
- "I love building things"
- a short supporting line about building practical software, browser tools, and local-first systems
- links to Projects, Now, GitHub, and Contact

## Projects

Initial project list:

- Defense Against Distractions
- Defense Against Distractions Windows
- other browser extensions and tools as they become relevant

Each project should show:

- what it is
- why it exists
- current status
- link to GitHub or release page

## Now

The first version should use GitHub activity and manual notes.

Do not expose raw calendar data by default. If a future calendar integration is added, it should show sanitized categories such as:

- building
- writing
- learning
- maintenance

No meeting titles, locations, private names, exact personal routines, or sensitive availability should be public by default.

## Localization

Start with a structure that supports localization from the beginning.

Suggested first languages:

- English
- German or Ukrainian

The exact language set can be decided when implementation starts.

## Non-Goals For First Version

- blog engine
- full CMS
- public live calendar feed
- analytics-heavy tracking
- login/account system
- marketplace for DaD configurations
- payment or premium features

## Implemented First Slice

- Static homepage
- Project section
- Current-focus section
- Public GitHub repository cards using GitHub's public browser API with no token
- English, German, and Ukrainian language switcher
- Temporary generated workspace image instead of a fake photo of Oleksandr
- GitHub Pages custom-domain setup through `CNAME`

## Open Stack Choice

Candidate stacks:

- Astro
- Next.js
- plain static site

The first implementation uses the plain static site path. A framework can be introduced later only if content or localization complexity justifies it.
