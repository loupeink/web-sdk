# @loupeink/web-sdk — Agent Instructions

This is the browser SDK for embedding [Loupe](https://loupe.ink) feedback capture in any web app.

## Package Overview

- **npm**: `@loupeink/web-sdk`
- **Repo**: `https://github.com/loupeink/web-sdk` (public, MIT)
- **Monorepo**: `https://github.com/AhsanAyaz/loupe` (private — this package lives at `packages/web-sdk/`)
- **License**: MIT

## Development

```bash
npm install
npm run build   # tsup (ESM + CJS + IIFE)
npm test        # vitest
```

## Key Files

- `src/index.tsx` — main entry point, exports `LoupeSDK`
- `src/screenshot.ts` — html2canvas-pro screenshot capture
- `src/annotation-step.tsx` — annotation UI with Shadow DOM CSS injection
- `tsup.config.ts` — build config (IIFE uses `env: { NODE_ENV: 'production' }` to avoid `process is not defined`)
- `README.md` — public-facing usage docs
- `CONTRIBUTING.md` — contributor guide

## Architecture Notes

- Uses Shadow DOM to isolate styles from the host page
- Tailwind + design tokens are injected via a CSS layer at init time (not via `<link>`)
- Screenshots use `window.scrollX/scrollY + innerWidth/innerHeight` as viewport bounds to avoid black gaps
- IIFE build is for `<script>` tag embedding; ESM/CJS for bundler import

## Conventions

- TypeScript strict mode
- Named exports only
- Shadow DOM for style isolation — never add global CSS

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full setup instructions. Changes are made in the private monorepo and synced here via `git subtree`.
