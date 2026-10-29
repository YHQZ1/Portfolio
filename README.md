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

It is a client-rendered React application with three pages, a small dependency footprint and no backend. The contact form talks directly to EmailJS.

| Route      | Page                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| `/`        | Profile: selected work, focused projects, technical skills, activity and tools  |
| `/about`   | About: background, core competencies, work experience and community involvement |
| `/contact` | Contact: message form delivered through EmailJS                                 |
| `*`        | Not found                                                                       |

## Features

- **Tiered skills grid.** Skills are grouped into Core Stack, Applied Experience, and Exploration & Learning. Each one shows a proficiency level and an experience duration that is calculated from its start date, so it never goes stale.
- **Thirteen filters.** Narrow the grid by Languages, Frontend, Backend, Real-time, Low-level, Database, Cloud, DevOps, Observability, Big Data, Data Science, AI / ML or Testing. Selecting several filters shows only the skills that match all of them.
- **Project showcase.** A Selected Work section for flagship projects with cover images, and a Focused Projects section for tighter builds. Each card links to its repository and, when one exists, a live demo.
- **Tools and workflow.** The editors, API clients, package managers and collaboration tools I work with.
- **GitHub activity.** A contribution calendar for the last 12 months, scrolled to the most recent weeks on load.
- **Command palette.** Press `Ctrl+K` or `Cmd+K` on the profile page to jump to any section, with full keyboard navigation.
- **Light and dark themes.** Follows the system preference on first visit, then remembers your choice.
- **Custom cursor.** Enabled on pointer devices and disabled on touch screens.
- **Search and sharing metadata.** Open Graph and Twitter card tags, a JSON-LD `Person` schema, a sitemap and a `robots.txt`.

## Tech stack

| Area      | Technology                                              |
| --------- | ------------------------------------------------------- |
| UI        | React 19                                                |
| Routing   | React Router 7                                          |
| Build     | Vite 6 with the React plugin                            |
| Styling   | Tailwind CSS 4, PostCSS, Autoprefixer, Raleway typeface |
| Icons     | React Icons, plus local and CDN logos for skills        |
| Data viz  | react-github-calendar                                   |
| Email     | EmailJS (browser SDK)                                   |
| Quality   | ESLint 9 with React Hooks rules, Prettier               |
| Packaging | Docker multi-stage build served by nginx, or Vercel     |

## Project structure

```text
.
├── public/
│   ├── projects/            Cover images for Selected Work cards
│   ├── skills/              Local logos for skills and tools
│   ├── Resume.pdf
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── components/          Navbar, Footer, Cursor, CommandPalette,
│   │                        GitHubActivity and scroll helpers
│   ├── context/             ThemeProvider and the useTheme hook
│   ├── data/
│   │   ├── skills.jsx       Skills, tiers, levels and filters
│   │   ├── tools.jsx        Tools and workflow
│   │   ├── projects.jsx     Selected and focused projects
│   │   └── links.jsx        Social and contact links
│   ├── pages/               Profile, About, Contact, NotFound
│   ├── App.jsx              Routes and shared page layout
│   ├── main.jsx             Application entry point
│   └── index.css            Tailwind import and global styles
├── Dockerfile               Vite build, then nginx
├── nginx.conf               SPA fallback and long-lived asset caching
├── vercel.json              SPA rewrite for Vercel
├── eslint.config.js
└── tailwind.config.js
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
| `npm run build`        | Create the production build in `dist`       |
| `npm run preview`      | Serve the production build locally          |
| `npm run lint`         | Run ESLint and fail on any warning          |
| `npm run format`       | Format the repository with Prettier         |
| `npm run format:check` | Check formatting without writing changes    |
| `./git.sh "message"`   | Stage everything, commit and push to `main` |

## Editing the content

All content lives in `src/data`. Add, change or remove an entry and the page updates.

### Skills

`src/data/skills.jsx`

```js
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

| Field              | Notes                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tier`             | `core`, `applied` or `exploration`. Decides which section the skill appears in.                                                                                                         |
| `level`            | `Beginner`, `Intermediate` or `Advanced`.                                                                                                                                               |
| `experienceStart`  | `YYYY-MM`. The experience label (for example `2 years`) is derived from this.                                                                                                           |
| `category`         | Exactly three short descriptive tags.                                                                                                                                                   |
| `filterCategories` | Keys from the filter bar: `languages`, `frontend`, `backend`, `real-time`, `low-level`, `database`, `cloud`, `devops`, `observability`, `big-data`, `data-science`, `ai-ml`, `testing`. |
| `logo`, `darkLogo` | A URL or a path under `public/skills`. `darkLogo` is optional and used in dark mode.                                                                                                    |

### Projects

`src/data/projects.jsx`

```js
{
  title: "Hatch",
  category: "focused",
  description: "Render-style deploys into your own AWS account...",
  tags: ["Distributed Systems", "Cloud Infrastructure", "DevOps"],
  github: "https://github.com/YHQZ1/Hatch",
  live: null,
  image: null,
}
```

`category` is `selected` or `focused`. Only Selected Work cards display a cover image, so `image` can stay `null` for focused projects. When `live` is `null`, the demo button is hidden.

### Tools and links

`src/data/tools.jsx` lists tools with a `name`, a `logo` and three `category` tags. `src/data/links.jsx` holds the social icons in the footer and the Discord and email shortcuts.

### Contact form

The EmailJS service ID, template ID and public key are set in `src/pages/Contact.jsx`. A public key is designed to be visible in client code, so restrict the allowed origins to your domain from the EmailJS dashboard.

## Deployment

### Vercel

Import the repository and keep the Vite defaults. `vercel.json` rewrites every path to `index.html`, so direct visits to `/about` and `/contact` work with client-side routing.

### Docker

The image builds the site with Node, then serves the static output from nginx. `nginx.conf` falls back to `index.html` for client-side routes and caches hashed assets for a year.

```bash
docker build -t portfolio .
docker run --rm -p 8080:80 portfolio
```

The site is then available at [http://localhost:8080](http://localhost:8080).

## Code quality

- **ESLint** runs the recommended rules with React Hooks and React Refresh checks. `npm run lint` fails on any warning.
- **Prettier** formats the whole repository. Its settings are in `.prettierrc`, and `.prettierignore` skips build output, dependencies and static assets.
- The source contains no inline comments, so names and structure carry the meaning.
