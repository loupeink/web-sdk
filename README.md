# @loupe/web

[![npm version](https://img.shields.io/npm/v/@loupe/web)](https://www.npmjs.com/package/@loupe/web)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Floating feedback widget for web apps — captures screenshots, annotations, and page context, then submits directly to your [Loupe](https://useloupe.com) dashboard.

## Features

- **Floating button** — non-intrusive feedback trigger, configurable position and color
- **In-browser screenshot** — captures the visible viewport, no browser extension required
- **Annotation canvas** — draw, highlight, and blur regions on the screenshot before submitting
- **Context capture** — automatically records current URL, page title, viewport size, and user agent
- **Shadow DOM isolated** — widget styles never conflict with your app's CSS
- **Works everywhere** — npm/bundler or plain `<script>` tag (CDN)

## Install

```bash
npm install @loupe/web
# or
yarn add @loupe/web
# or
pnpm add @loupe/web
```

## Quick Start

### npm / bundler

```typescript
import { init } from '@loupe/web';

init({
  apiKey: 'lp_your_project_api_key',
});
```

### CDN / script tag

```html
<script src="https://cdn.jsdelivr.net/npm/@loupe/web/dist/index.global.js"></script>
<script>
  Loupe.init({ apiKey: 'lp_your_project_api_key' });
</script>
```

Place the snippet before `</body>`. The widget mounts automatically.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **required** | Project API key from Loupe dashboard |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Button position |
| `color` | `string` | `'#10b981'` | Button background color (any CSS color) |
| `buttonLabel` | `string` | `'Feedback'` | Button text |
| `endpoint` | `string` | Loupe production URL | Override Edge Function URL (self-hosted) |

## Getting an API key

1. Sign in to your [Loupe dashboard](https://useloupe.com)
2. Open a project → **API Keys**
3. Click **Generate key** — copy the `lp_…` key
4. Pass it to `init({ apiKey: '...' })`

## How it works

1. User clicks the floating button
2. Widget captures the visible viewport via `html2canvas`
3. Annotation overlay opens — user can draw, highlight, or blur regions on the screenshot
4. User adds a comment and optionally sets severity (`critical`, `major`, `minor`, `suggestion`)
5. Annotated screenshot + metadata POST to the Loupe Edge Function, authenticated with the API key
6. Feedback appears instantly in the Loupe dashboard

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
