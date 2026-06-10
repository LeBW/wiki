# Migration Plan: VuePress 1.x → VitePress

## Summary

Migrate this personal wiki from VuePress 1.x (Webpack-based) to VitePress (Vite-based). Content stays in `docs/`, config moves from `docs/.vuepress/` to `docs/.vitepress/`. No custom Vue components or custom styles exist — pure Markdown with images.

## Tasks

### 1. Update `package.json`
- Replace `"vuepress"` devDependency with `"vitepress": "^1.6.4"` (already present)
- Update scripts: `"dev": "vitepress dev docs"`, `"build": "vitepress build docs"`, add `"preview": "vitepress preview docs"`

### 2. Create `docs/.vitepress/config.mjs`
Convert from VuePress `module.exports` to VitePress `defineConfig`:

**Key differences:**
- `sidebarDepth` → handled per-item with `collapsed` in VitePress (or omitted — defaults work)
- `head` for favicon: VitePress uses `head: [['link', { rel: 'icon', href: '/lbw-wiki.png' }]]` (same format)
- `host: '0.0.0.0'` → not needed, VitePress binds to `0.0.0.0` by default
- Sidebar definitions: same path-prefix keys and array format work in VitePress
- Nav: same structure works, but VitePress uses `{ text, link }` or `{ text, items: [...] }`

**Config structure:**
```js
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "LBW's Wiki Pages",
  description: 'Organize all of my knowledge.',
  base: '/',
  head: [['link', { rel: 'icon', href: '/lbw-wiki.png' }]],
  themeConfig: {
    nav: [...],       // same nav structure
    sidebar: {...},   // same sidebar functions
  },
})
```

### 3. Move public assets
- Move `docs/.vuepress/public/lbw-wiki.png` → `docs/.vitepress/public/lbw-wiki.png`
- Move `docs/.vuepress/public/CNAME` → `docs/.vitepress/public/CNAME`

### 4. Update homepage (`docs/README.md`)
Convert from VuePress format:
```yaml
---
home: true
heroImage: /lbw-wiki.png
actionText: Go to OverView →
actionLink: /overview/
footer: MIT Licensed | Copyright © 2019-present Bowen Li
---
```
To VitePress format:
```yaml
---
layout: home

hero:
  name: "LBW's Wiki Pages"
  text: Organize all of my knowledge.
  image: /lbw-wiki.png
  actions:
    - theme: brand
      text: Go to OverView
      link: /overview/

footer: MIT Licensed | Copyright © 2019-present Bowen Li
---
```

### 5. Update deploy workflow (`.github/workflows/deploy.yml`)
- Node version: `16` → `18` (VitePress requires Node 18+)
- Build output: `docs/.vuepress/dist` → `docs/.vitepress/dist`

### 6. Remove old `.vuepress/` directory
- Delete `docs/.vuepress/` after confirming everything works

## What stays the same
- All 96 markdown content files — no changes needed
- All images (relative paths like `./image.png`) — work unchanged in VitePress
- Custom domain (`wiki.libowen.website`) via CNAME file
- `docs/.vitepress/public/` serves static files same as before

## What's NOT needed (not in current project)
- No custom Vue components to migrate
- No custom styles (`.styl`/`.css`) to migrate
- No `enhanceApp.js` to migrate
