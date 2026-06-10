# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal wiki/knowledge base built with **VitePress** (Vite-based static site generator). Content is written in Markdown with Chinese and English technical documentation covering computer science, backend engineering, DevOps, and more. Deployed to GitHub Pages at [wiki.libowen.website](https://wiki.libowen.website).

## Commands

```bash
# Install dependencies (Node.js 18+)
npm install

# Start local dev server with hot-reload
npm run dev

# Build static site (output to docs/.vitepress/dist)
npm run build

# Preview build output locally
npm run preview
```

## Architecture

- **`docs/`** — All documentation content, organized by topic:
  - `docs/algorithm/` — Data structures & algorithms
  - `docs/operating-system/` — OS concepts (processes, memory, file system, IO, IPC)
  - `docs/computer-network/` — HTTP, TCP, UDP, IP
  - `docs/distributed-system/` — CAP theorem, distributed transactions
  - `docs/language/` — Java (JVM, concurrency, GC) and C/C++
  - `docs/backend/` — Tomcat, Jetty, Spring, Database, Redis
  - `docs/microservice/` — SOA, microservice architecture
  - `docs/docker/` — Docker containers & practice
  - `docs/kubernetes/` — K8s components, scheduler, ingress, cluster setup
  - `docs/frontend/` — HTTP, CSS, JavaScript, AJAX, same-origin policy
  - `docs/linux/` — Common commands, file system, vim config
  - `docs/devops/` — DevOps culture, code management, Jenkins
  - `docs/overview/` — Site overview
- **`docs/.vitepress/`** — VitePress configuration:
  - `config.mjs` — Site config including nav and sidebar definitions
- **`docs/public/`** — Static assets (logo, CNAME for custom domain)
- **`images/`** — Screenshots and assets used in README
- **Deployment**: GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to `gh-pages` branch when pushing to `master`. Also supports Docker/Nginx deployment via `Docker-compose.yml`.

## Content Conventions

- Each topic directory has an `index.md` as the section landing page.
- Sidebar and navigation are configured in `docs/.vitepress/config.mjs`.
- Markdown files reference local images by relative paths.

## Deployment

- **CI/CD**: GitHub Actions on push to `master` — runs `npm install && npm run build`, deploys `docs/.vitepress/dist` to `gh-pages` branch using `crazy-max/ghaction-github-pages`.
- **Custom domain**: `wiki.libowen.website` (configured in `docs/public/CNAME`).
- **Docker**: An nginx container serving the built static site.
