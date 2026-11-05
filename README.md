<div align="center">

<img src="public/logo.png" alt="Uttkarsh Ruparel" width="96" height="96" />

# Uttkarsh Ruparel

**Portfolio of a backend and infrastructure engineer.**
Projects, skills and background, built as a fast, data-driven single page app.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-nginx-2496ED?style=flat-square&logo=docker&logoColor=white)

[Live site](https://uttkarsh.dev) &nbsp;|&nbsp; [Resume](public/Resume.pdf) &nbsp;|&nbsp; [GitHub](https://github.com/YHQZ1)

</div>

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Editing the content](#editing-the-content)
- [Deployment](#deployment)
- [Code quality](#code-quality)

---

## Overview

This site is the single place that presents my work: the systems I have built, the technologies I use and how deeply, and the experience behind them. Every list on the site (projects, skills, tools and social links) is plain data in `src/data`, so updating the portfolio means editing a file, not touching components.

It is a client-rendered React application with a handful of pages, a small dependency footprint and one small serverless function (the contact form). Only the home page ships in the first bundle; the other routes are lazy-loaded and prefetched when the browser is idle. The contact form posts to that function, which sends the message through Resend.

| Route             | Page                                                                                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | Home: selected work, focused projects, technical skills, activity and tools                                                                                                                                                                                                                                       |
| `/projects/:slug` | Project detail for a selected project: logo panel, architecture diagram, overview, highlights and the stack it uses                                                                                                                                                                                               |
| `/about`          | About: short statement and a continuous intro beside a tall portrait, core competencies with the technologies behind each, work experience, the community journey as a timeline (horizontal on desktop, a LinkedIn-style vertical strip on smaller screens) and a closing statement with contact and resume links |
| `/contact`        | Contact: statement, direct channels and a message form delivered through Resend                                                                                                                                                                                                                                   |
| `*`               | Not found                                                                                                                                                                                                                                                                                                         |

## Features

- **Skills index.** All skills are listed by what they are used for (languages, backend, frontend, data stores, cloud and DevOps, big data, AI and data science, testing), as logos and names in aligned columns. Core skills are shown brightest. Hovering or tapping one reveals its level, an experience duration calculated from its start date (so it never goes stale) and what it is used for.
- **Project showcase.** Selected projects are tiles in the hero that open a detail page with a logo panel, an animated architecture diagram (logo and name on one row, centred in each node), an overview, highlights and a logo list of the stack used, taken from the diagram; hovering one dims the others and draws a line across its top. Focused projects live in an expandable archive list. Each links to its repository and, when one exists, a live demo.
- **Tools and workflow.** The editors, API clients, package managers and collaboration tools I work with, grouped and shown right under the skills.
- **GitHub activity.** Total contributions, active days, longest streak and busiest month for the last 12 months, above a grayscale contribution grid (hover or tap a day for its count; phones show the latest six months). Data comes from the public contributions API.
- **Command palette.** Press `Ctrl+K` or `Cmd+K` on the home and about pages to jump to any section, with full keyboard navigation.
- **Light and dark themes.** Follows the system preference on first visit, then remembers your choice.
- **Search and sharing metadata.** Open Graph and Twitter card tags, a JSON-LD `Person` schema, a sitemap and a `robots.txt`.

## Tech stack

| Area      | Technology                                                           |
| --------- | -------------------------------------------------------------------- |
| UI        | React 19                                                             |
| Language  | TypeScript 6 in strict mode                                          |
| Routing   | React Router 7                                                       |
| Build     | Vite 6 with the React plugin                                         |
| Styling   | Tailwind CSS 4, PostCSS, self-hosted Raleway                         |
| Icons     | React Icons, plus local and CDN logos for skills                     |
| Data      | Public GitHub contributions API                                      |
| Email     | Resend, called from a Vercel function (`api/contact.ts`)             |
| Quality   | tsc, ESLint 9, Prettier, Vitest with Testing Library, GitHub Actions |
| Packaging | Docker multi-stage build served by nginx, or Vercel                  |

## Project structure

```text
.
├── public/
│   ├── fonts/               Self-hosted Raleway (preloaded, no flash of unstyled text)
│   ├── projects/            Light and dark logo variants for selected projects
│   ├── skills/              Local logos for skills and tools (WebP, at most 96px, about 390 KB in total)
│   ├── Resume.pdf
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/              Small reusable pieces: Container, SectionHeading, TextLink,
│   │   │                    LinkRow, CodeLink, ThemedImage, ProjectLogo, Collapse, StackIndex
│   │   ├── layout/          PageLayout, ErrorBoundary, nav/ (Navbar and its parts),
│   │   │                    ScrollProgress, ScrollToTop, ScrollToTopButton,
│   │   │                    CommandPalette, ShortcutHint
│   │   ├── home/            hero/ (Hero, failover diagram, signature, project tiles),
│   │   │                    ProjectArchive, GitHubActivity
│   │   ├── project/         ArchitectureDiagram
│   │   └── about/           Organization, RoleTimeline
│   ├── context/             ThemeProvider and SoundProvider with their hooks
│   ├── data/
│   │   ├── skills.ts        Skills, tiers, levels and topics
│   │   ├── tools.ts         Tools and workflow
│   │   ├── projects.ts      Selected and focused projects
│   │   ├── about.ts         About page copy, competencies and roles
│   │   ├── links.ts         Social and contact links
│   │   ├── site.ts          Site URL, email and GitHub username
│   │   ├── stackGroups.ts   Skills and tools grouped for display
│   │   ├── logos.ts         Logo lookup by name
│   │   └── types.ts         Shared data shapes
│   ├── hooks/               usePageMeta, useTypewriter and useContributions
│   ├── lib/                 sounds.ts, the Web Audio sound engine
│   ├── pages/               Home, ProjectDetail, About, Contact, NotFound
│   ├── App.tsx              Lazy routes and route prefetching
│   ├── main.tsx             Application entry point
│   ├── test/                Vitest setup (browser API stubs)
│   └── index.css            Tailwind import, color tokens, the eyebrow and body-text utilities and global styles
├── api/                     contact.ts (Vercel function) and _lib/ (validation, email, rate limit)
├── .github/                 CI workflow, Dependabot config and PR template
├── Dockerfile               Vite build, then nginx
├── nginx.conf               SPA fallback and long-lived asset caching
├── vercel.json              SPA rewrite for Vercel
├── eslint.config.js
├── tsconfig.json            Strict TypeScript settings
├── vite.config.ts
└── .env.example             Contact form environment variables
```

## Getting started

You need Node.js 20 or newer.

```bash
git clone https://github.com/YHQZ1/Portfolio.git
cd Portfolio
npm install
npm run dev
```

The dev server starts on [http://localhost:5173](http://localhost:5173) with hot reloading.

To build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Scripts

| Command                | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                   |
| `npm run typecheck`    | Type-check the project with `tsc`           |
| `npm run build`        | Type-check, then create the build in `dist` |
| `npm run preview`      | Serve the production build locally          |
| `npm run lint`         | Run ESLint and fail on any warning          |
| `npm test`             | Run the Vitest suite once                   |
| `npm run test:watch`   | Run Vitest in watch mode                    |
| `npm run format`       | Format the repository with Prettier         |
| `npm run format:check` | Check formatting without writing changes    |
| `./git.sh "message"`   | Stage everything, commit and push to `main` |

## Editing the content

All content lives in `src/data`. Add, change or remove an entry and the page updates.

### Skills

`src/data/skills.ts`

```ts
{
  name: "Go",
  tier: "core",
  logo: "https://cdn.simpleicons.org/go/00ADD8",
  level: "Intermediate",
  experienceStart: "2026-03",
  category: ["Goroutine Concurrency", "Microservices", "Systems Programming"],
  filterCategories: ["languages", "backend", "low-level"],
}
```

| Field              | Notes                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tier`             | `core`, `applied` or `exploration`. Decides which section the skill appears in.                                                                                                            |
| `level`            | `Beginner`, `Intermediate` or `Advanced`.                                                                                                                                                  |
| `experienceStart`  | `YYYY-MM`. The experience label (for example `2 years`) is derived from this.                                                                                                              |
| `category`         | Exactly three short descriptive tags.                                                                                                                                                      |
| `filterCategories` | Topic keys kept in the data: `languages`, `frontend`, `backend`, `real-time`, `low-level`, `database`, `cloud`, `devops`, `observability`, `big-data`, `data-science`, `ai-ml`, `testing`. |
| `logo`, `darkLogo` | A URL or a path under `public/skills` (use a small WebP, 96px on the longest side). `darkLogo` is optional and used in dark mode.                                                          |

### Projects

`src/data/projects.ts`

```ts
{
  slug: "hatch",
  title: "Hatch",
  category: "selected",
  summary: "Render-style deploys into your own AWS account...",
  description: "Render-style deploys into your own AWS account...",
  tags: ["Distributed Systems", "Cloud Infrastructure", "DevOps"],
  github: "https://github.com/YHQZ1/Hatch",
  live: null,
  logo: { light: "/projects/hatch-light.svg", dark: "/projects/hatch-dark.svg" },
  highlights: ["..."],
  architecture: { cols: 3, nodes: [...], edges: [...], note: "..." },
}
```

`category` is `selected` or `focused`. Selected projects get a card with a logo and a detail page at `/projects/<slug>`, and the card grid adapts to any number of them. Focused projects only need `slug`, `title`, `summary`, `description`, `tags`, `github` and `live`, and appear in the expandable archive. When `live` is `null`, the demo link is hidden.

Architecture diagrams are plain data and flow left to right: `stages` are the labelled columns, and each node has a `col` (its stage) and a `row` (rows can be fractional, for example `0.5`, to centre a node between two others), a `title`, an optional `sub` line, optional `icons` (names of skills or tools, so their logos are reused, including dark variants) and a `kind` of `service`, `store` or `external`. Each edge connects two node ids. The diagram is drawn from this and follows the light and dark themes.

### Tools and links

`src/data/tools.ts` lists tools with a `name`, a `group`, a `logo` and three `category` tags. `src/data/links.ts` holds the social links shown in the navbar and on the contact page, plus the Discord shortcut.

### Contact form

The form posts to `api/contact.ts`, a Vercel function that validates the message and sends it with [Resend](https://resend.com). The API key never reaches the browser.

What the function does: accepts `POST` only, caps the request at 16 KB, limits one sender to 5 messages per 10 minutes (per serverless instance, so add a Vercel firewall rule for a hard limit), validates every field, strips line breaks from header fields, escapes HTML, silently drops submissions that fill the hidden `website` honeypot field, and sets the visitor's address as `Reply-To` so you can answer directly.

Messages are always delivered to the address in `src/data/site.ts` (`rupareluttkarsh2309@gmail.com`, the email of the Resend account). The recipient is deliberately not configurable, so it cannot be redirected through the environment. Set these environment variables (see `.env.example`):

| Variable             | Required | Purpose                                                                                                                                                   |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | Yes      | Your Resend API key.                                                                                                                                      |
| `CONTACT_FROM_EMAIL` | No       | The sender. Defaults to `Portfolio Contact <onboarding@resend.dev>`. Use an address on a domain you have verified in Resend to send from your own domain. |

On Vercel, add them under Project Settings, Environment Variables (Production and Preview). Locally, put `RESEND_API_KEY` in `.env.local` (git-ignored); `npm run dev` serves `/api/contact` from the same function, so no extra tooling is needed.

## Deployment

### Vercel

Import the repository and keep the Vite defaults. `vercel.json` rewrites every path to `index.html`, so direct visits to `/about` and `/contact` work with client-side routing, while `/api/*` is left to the serverless functions.

### Docker

The image builds the site with Node, then serves the static output from nginx. It has no serverless runtime, so the contact form needs the function hosted elsewhere (for example on Vercel) when you deploy this way. `nginx.conf` falls back to `index.html` for client-side routes and caches hashed assets for a year.

```bash
docker build -t portfolio .
docker run --rm -p 8080:80 portfolio
```

The site is then available at [http://localhost:8080](http://localhost:8080).

## Code quality

- **TypeScript** runs in strict mode. `npm run build` type-checks before bundling, so a type error fails the build. Skills, tools, projects and links are typed in `src/data`, so a mistyped tier, level or filter key is a compile error.
- **ESLint** runs the recommended rules with typescript-eslint, React Hooks and React Refresh checks. `npm run lint` fails on any warning.
- **Prettier** formats the whole repository. Its settings are in `.prettierrc`, and `.prettierignore` skips build output, dependencies and static assets.
- **Design tokens.** Every colour is one of eight semantic tokens (`bg`, `surface`, `raised`, `line`, `line-strong`, `fg`, `muted`, `faint`) defined once in `src/index.css` for light and dark, and used as Tailwind classes such as `bg-surface` or `text-muted`. Components never hard-code colours, and switching theme only flips a class on the page. Two shared recipes, `eyebrow` (small uppercase labels) and `body-text` (long-form copy), are defined next to the tokens. `index.html` repeats the two background colours so the page does not flash before the CSS loads; keep them in sync.
- **Mobile and tablet.** Every page is checked from 320px up, with no horizontal scroll at any width. Below 1024px the navbar becomes a full-screen menu that locks page scroll and closes on Escape or navigation. Small controls get larger invisible tap areas (the `tap-area` utility); the contribution grid shows the latest 18 weeks on phones and can be scrubbed by dragging a finger across it; the architecture diagram keeps its text readable and scrolls sideways; the skills lists flow as wrapped rows on phones (a grid from tablet up); the About portrait comes first on phones; form fields use 18px text so iOS does not zoom in on focus.
- **Theme switching.** The theme change spreads across the page in a circle from the toggle button (the View Transitions API, with a half-second clip-path animation on the new theme; the toggle icon turns in step). It falls back to an instant switch in browsers without the API, when the person prefers reduced motion, or if the browser never renders the transition (a safety timeout applies the theme anyway). CSS transitions are paused for the swap (the `theme-switching` class), so every colour changes in the same frame.
- **Sound (opt-in).** The speaker button in the navbar turns on small synthesized sounds (Web Audio, so no audio files): a pitched tick as you move across the contribution grid, a sweep with the theme change, a thud and a chime when you break and recover a service in the hero diagram, a click when you copy the Discord handle and a chime when a message sends. It is off by default, remembers your choice, stays silent until you have interacted with the page, and never plays in a background tab. The engine is in `src/lib/sounds.ts` and the opt-in state in `src/context/SoundContext.tsx`.
- **Resilience.** An error boundary in `PageLayout` shows a reload prompt if a page throws or a lazy chunk fails to load (for example after a deploy), and resets when you navigate.
- **Tests** use Vitest with Testing Library. Unit tests cover the contribution statistics and the contact function (validation, honeypot, rate limit, escaping, Resend failures); data tests check that project slugs are unique, every architecture diagram is internally consistent, every diagram icon resolves to a logo and every local logo file exists; page tests render each route and exercise the contact form, including the success and failure paths with the API mocked.
- **CI** (`.github/workflows/ci.yml`) runs a clean install, the formatting check, type check, lint, tests and a production build on every pull request and on pushes to `main`. Dependabot proposes grouped weekly dependency updates and monthly GitHub Actions and Docker updates.
- Comments are kept for the non-obvious why (browser quirks, deliberate trade-offs); names and structure carry the rest.
