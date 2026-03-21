# Contributing to @loupe/web

Thanks for your interest in contributing! This is the public SDK repo for [Loupe](https://useloupe.com).

## Development Setup

```bash
git clone https://github.com/AhsanAyaz/loupe-web-sdk.git
cd loupe-web-sdk
npm install
```

## Build

```bash
npm run build        # ESM + CJS + IIFE
```

Output lands in `dist/`:
- `dist/index.js` — ESM
- `dist/index.cjs` — CommonJS
- `dist/index.global.js` — IIFE for CDN/script-tag use (`window.Loupe`)

## Tests

```bash
npm test             # run vitest
npm run test:watch   # watch mode
```

## Code Style

- TypeScript strict mode
- No external runtime dependencies (everything bundled into the IIFE)
- Shadow DOM for style isolation — all widget styles must be injected into the shadow root

## Submitting Changes

1. Fork the repo and create a branch: `git checkout -b fix/your-fix`
2. Make your changes with tests
3. Run `npm test` and `npm run build` — both must pass
4. Open a pull request with a clear description

## Reporting Issues

Open a GitHub issue. For security issues, email the maintainers directly.

## License

By contributing, you agree your contributions will be licensed under MIT.
