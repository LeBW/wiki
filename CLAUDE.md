# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal wiki/knowledge base built with **VuePress 1.x** (Webpack-based static site generator). Content is written in Markdown with Chinese and English technical documentation covering computer science, backend engineering, DevOps, and more. Deployed to GitHub Pages at [wiki.libowen.website](https://wiki.libowen.website).

## Commands

```bash
# Install dependencies (Node.js 10+, tested with 16.x)
npm install

# Start local dev server with hot-reload
npm run dev

# Build static site (output to docs/.vuepress/dist)
npm run build
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
- **`docs/.vuepress/`** — VuePress configuration:
  - `config.js` — Site config including sidebar definitions (one function per topic area)
  - `nav.js` — Navigation bar structure (概览, 基础知识, 编程语言, 后端, 微服务, 其他)
  - `public/` — Static assets (logo, CNAME for custom domain)
- **`images/`** — Screenshots and assets used in README
- **Deployment**: GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to `gh-pages` branch when pushing to `master`. Also supports Docker/Nginx deployment via `Docker-compose.yml`.

## Content Conventions

- Each topic directory has a `README.md` as the section landing page.
- Sidebar configuration in `config.js` lists the order of pages per section — adding a new page requires updating the corresponding sidebar function.
- Navigation links are defined in `nav.js` with grouped dropdowns.
- Markdown files reference local images by relative paths.

## Deployment

- **CI/CD**: GitHub Actions on push to `master` — runs `npm install && npm run build`, deploys `docs/.vuepress/dist` to `gh-pages` branch using `crazy-max/ghaction-github-pages`.
- **Custom domain**: `wiki.libowen.website` (configured in `docs/.vuepress/public/CNAME`).
- **Docker**: An nginx container serving the built static site.
