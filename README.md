# @loupe/web

Floating feedback widget for web apps. Captures screenshots, page context, and submits feedback to your Loupe dashboard.

## Install

```bash
npm install @loupe/web
```

## Usage (npm / bundler)

```typescript
import { init } from '@loupe/web';

init({ apiKey: 'lp_your_key_here' });
```

## Usage (CDN / script tag)

```html
<script src="https://cdn.jsdelivr.net/npm/@loupe/web/dist/index.global.js"></script>
<script>
  Loupe.init({ apiKey: 'lp_your_key_here' });
</script>
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string | required | Project API key from Loupe dashboard |
| position | `'bottom-right'` \| `'bottom-left'` \| `'top-right'` \| `'top-left'` | `'bottom-right'` | Button position |
| color | string | `'#10b981'` | Button background color |
| buttonLabel | string | `'Feedback'` | Button text |
| endpoint | string | (Loupe production URL) | Override Edge Function URL (self-hosted) |

## Getting an API key

Generate a key from your project page in the Loupe dashboard.

## License

MIT
