# Personal website

Vue 3 SPA with bilingual routing, motion, and a few focused UI experiments—built as a small portfolio-style site you can extend over time.

**Live:** [GitHub Pages](https://casualattitude0.github.io/vue-component-practice/) · **Source:** [casualattitude0/vue-component-practice](https://github.com/casualattitude0/vue-component-practice)

## Stack

| Area      | Choice                         |
| --------- | ------------------------------ |
| Framework | Vue 3                          |
| Routing   | Vue Router 4 (locale segments) |
| i18n      | vue-i18n — English & 繁體中文  |
| Styling   | Tailwind CSS 4, PostCSS        |
| Animation | GSAP                           |
| Tooling   | Vue CLI 5, ESLint              |

## What’s in the app

- **Home** (`/en`, `/tw`) — hero, scroll-reveal sections, site navigation.
- **Demos** — carousel, card interactions, Figma transfer test (`/carousel`, `/card-demo`, `/figam-transfer-test`.... under each locale).

Root `/` redirects to the default locale; paths are `/:locale(en|tw)/…`.

## Local development

```bash
yarn install
yarn serve
```

```bash
yarn build
yarn lint
```

Uses [Vue CLI configuration](https://cli.vuejs.org/config/) (`vue.config.js`).

## Deploy (GitHub Pages)

Project sites need the correct asset base URL. From the repo root:

```bash
PUBLIC_PATH=/vue-component-practice/ ./scripts/deploy-gh-pages.sh
```

`GIT_REMOTE`, `DEPLOY_BRANCH`, and `PUBLIC_PATH` are overridable environment variables (see `scripts/deploy-gh-pages.sh`).
