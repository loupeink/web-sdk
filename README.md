# @loupeink/web-sdk

[![npm version](https://img.shields.io/npm/v/@loupeink/web-sdk)](https://www.npmjs.com/package/@loupeink/web-sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Floating feedback widget for web apps — captures screenshots, annotations, and page context, then submits directly to your [Loupe](https://loupe.ink) dashboard.

## Features

- **Floating button** — non-intrusive feedback trigger, configurable position, color, and offset
- **In-browser screenshot** — captures the visible viewport, no browser extension required
- **Annotation canvas** — draw, highlight, and blur regions on the screenshot before submitting
- **Context capture** — automatically records current URL, page title, viewport size, and user agent
- **Shadow DOM isolated** — widget styles never conflict with your app's CSS
- **Light / dark / auto theme** — follows system preference or set explicitly
- **Programmatic API** — `open()`, `close()`, `toggle()` the modal from your own code
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
| `apiKey` | `string` | **required** | Project API key from the Loupe dashboard |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Button corner position |
| `color` | `string` | `'#10b981'` | Button background color (any CSS color) |
| `buttonLabel` | `string` | `'Feedback'` | Button text |
| `buttonHtml` | `string` | — | Custom HTML for the button (overrides `buttonLabel`) |
| `hideBranding` | `boolean` | `false` | Hide "Powered by Loupe" link (Pro & Team plans) |
| `showDelayMs` | `number` | `0` | Delay in ms before the button appears after `mount()` |
| `offset` | `{ x?: number; y?: number }` | `{ x: 24, y: 24 }` | Pixel offset from the viewport edge |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'dark'` | Modal color theme (`'auto'` follows system preference) |
| `zIndex` | `number` | `2147483647` | CSS z-index for the widget |
| `screenshotEnabled` | `boolean` | `true` | Set to `false` to skip screenshot capture and annotation |
| `defaultSeverity` | `'critical' \| 'major' \| 'minor' \| 'suggestion'` | `'minor'` | Pre-selected severity in the dropdown |
| `successMessage` | `string` | `'Feedback sent. Thank you!'` | Toast text shown after submit (when no GitHub issue URL) |
| `publicWarning` | `'github' \| 'linear' \| 'both'` | — | Shows an amber privacy notice when feedback is auto-posted to a public destination |
| `onSubmit` | `(result: { id: string; url?: string; github_issue_url?: string }) => void` | — | Callback fired after successful submission |
| `stripUrlParams` | `boolean` | `false` | Strip query parameters from the page URL captured in context |
| `edgeFunctionUrl` | `string` | Loupe production URL | Override the Edge Function URL (self-hosted) |

## Getting an API key

1. Sign in at [app.loupe.ink](https://app.loupe.ink)
2. Go to **Organization Settings → API Keys** (top-right menu → Settings → API Keys tab)
3. Select a project, optionally add a label, click **Generate**
4. Copy the `lp_…` key — it is shown only once
5. Pass it to `init({ apiKey: '...' })`

## Examples

### Delayed appearance

Show the button 3 seconds after page load — useful for not distracting users immediately:

```typescript
init({
  apiKey: 'lp_your_key',
  showDelayMs: 3000,
});
```

### Custom position and offset

```typescript
init({
  apiKey: 'lp_your_key',
  position: 'bottom-left',
  offset: { x: 32, y: 32 },
});
```

### Light theme

```typescript
init({
  apiKey: 'lp_your_key',
  theme: 'light',        // or 'auto' to follow system preference
});
```

### Skip screenshot (faster, lighter)

```typescript
init({
  apiKey: 'lp_your_key',
  screenshotEnabled: false,
});
```

### Programmatic open/close

```typescript
import { init, getWidget } from '@loupeink/web-sdk';

init({ apiKey: 'lp_your_key' });

// Open the modal from your own button or trigger
document.querySelector('#my-help-btn').addEventListener('click', () => {
  getWidget()?.open();
});
```

### Privacy warning for public destinations

If your Loupe project auto-pushes to a public GitHub repo, show users a notice before they submit:

```typescript
init({
  apiKey: 'lp_your_key',
  publicWarning: 'github',   // 'github' | 'linear' | 'both'
});
```

### Submit callback

```typescript
init({
  apiKey: 'lp_your_key',
  onSubmit: (result) => {
    console.log('Feedback submitted:', result.id);
    if (result.github_issue_url) {
      console.log('GitHub issue:', result.github_issue_url);
    }
  },
});
```

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
  edgeFunctionUrl: 'https://your-server.com/feedback',
});
```

Your endpoint receives: `apiKey`, `comment`, `severity`, `screenshotDataUrl` (base64 PNG), and a `context` object (`url`, `title`, `viewport`, `userAgent`).

## License

[MIT](./LICENSE)
