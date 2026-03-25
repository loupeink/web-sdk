# @loupeink/web-sdk

[![npm version](https://img.shields.io/npm/v/@loupeink/web-sdk)](https://www.npmjs.com/package/@loupeink/web-sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Floating feedback widget for web apps — captures screenshots, annotations, and page context, then submits directly to your [Loupe](https://loupe.ink) dashboard.

## Features

- **Floating button** — non-intrusive feedback trigger, configurable position and color
- **In-browser screenshot** — captures the visible viewport, no browser extension required
- **Annotation canvas** — draw, highlight, and blur regions on the screenshot before submitting
- **Context capture** — automatically records current URL, page title, viewport size, and user agent
- **Shadow DOM isolated** — widget styles never conflict with your app's CSS
- **Works everywhere** — npm/bundler or plain `<script>` tag (CDN)

## Install

```bash
npm install @loupeink/web-sdk
# or
yarn add @loupeink/web-sdk
# or
pnpm add @loupeink/web-sdk
```

## Quick Start

### npm / bundler

```typescript
import { init } from '@loupeink/web-sdk';

init({
  apiKey: 'lp_your_project_api_key',
});
```

### CDN / script tag

```html
<script src="https://cdn.jsdelivr.net/npm/@loupeink/web-sdk/dist/index.global.js"></script>
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

1. Sign in to [app.loupe.ink](https://app.loupe.ink)
2. Open a project → **API Keys**
3. Click **Generate key** — copy the `lp_…` key
4. Pass it to `init({ apiKey: '...' })`

## React

Call `init` once at the app root. Use `destroy` for cleanup in StrictMode:

```tsx
import { useEffect } from 'react';
import { init, destroy } from '@loupeink/web-sdk';

export function App() {
  useEffect(() => {
    init({ apiKey: import.meta.env.VITE_LOUPE_API_KEY });
    return () => destroy();
  }, []);

  return <YourApp />;
}
```

Store your API key in `.env` as `VITE_LOUPE_API_KEY` — never commit it directly.

## Cleanup

To remove the widget from the DOM (route changes, test teardown, etc.):

```typescript
import { destroy } from '@loupeink/web-sdk';

destroy();
```

## How it works

1. User clicks the floating button
2. Widget captures the visible viewport via `html2canvas` — no browser extension required
3. Annotation overlay opens — user can draw, highlight, or blur regions on the screenshot
4. User adds a comment and sets severity (`critical`, `major`, `minor`, `suggestion`)
5. Annotated screenshot + metadata POST to the Loupe Edge Function, authenticated with the API key
6. Feedback appears instantly in the Loupe dashboard with URL, viewport, and browser context attached

## Self-hosted / custom endpoint

Route feedback through your own backend:

```typescript
init({
  apiKey: 'lp_your_key',
  endpoint: 'https://your-server.com/feedback',
});
```

Your endpoint receives: `apiKey`, `comment`, `severity`, `screenshotDataUrl` (base64 PNG), and a `context` object (`url`, `title`, `viewport`, `userAgent`).

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
