import React from 'react';
import { createRoot } from 'react-dom/client';
import { KonvaCanvas } from '@loupe/ui';
import type { AnnotationShape } from '@loupe/ui';

// Full Tailwind + design-token CSS injected into Shadow DOM.
// KonvaCanvas and KonvaToolbar use Tailwind utility classes and custom tokens
// (bg-surface-1, border-border-default, etc.) that don't exist in the IIFE
// bundle. We translate every class they use into explicit rules here.
const ANNOTATION_CSS = `
  /* ── Design tokens ─────────────────────────────────────── */
  .loupe-annotation-wrap {
    --color-surface-0: #09090b;
    --color-surface-1: #121215;
    --color-surface-2: #1a1a1f;
    --color-surface-3: #222228;
    --color-text-primary: #fafafa;
    --color-text-secondary: #a1a1aa;
    --color-border-default: #27272a;
    --color-accent: #34d399;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    color: var(--color-text-primary);
    box-sizing: border-box;
  }
  .loupe-annotation-wrap *, .loupe-annotation-wrap *::before, .loupe-annotation-wrap *::after {
    box-sizing: border-box;
  }

  /* ── Layout ─────────────────────────────────────────────── */
  .flex      { display: flex; }
  .flex-col  { flex-direction: column; }
  .flex-wrap { flex-wrap: wrap; }
  .flex-1    { flex: 1 1 0%; }
  .flex-shrink-0 { flex-shrink: 0; }
  .items-center  { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-1   { gap: 4px; }
  .gap-0\\.5 { gap: 2px; }
  .space-y-1 > * + * { margin-top: 4px; }
  .min-w-0 { min-width: 0; }

  /* ── Sizing ──────────────────────────────────────────────── */
  .h-full { height: 100%; }
  .h-4 { height: 16px; }
  .h-6 { height: 24px; }
  .h-8 { height: 32px; }
  .w-4 { width: 16px; }
  .w-6 { width: 24px; }
  .w-8 { width: 32px; }
  .w-px { width: 1px; }
  .w-72 { width: 288px; }

  /* ── Spacing ─────────────────────────────────────────────── */
  .p-0   { padding: 0; }
  .p-3   { padding: 12px; }
  .p-4   { padding: 16px; }
  .px-1\\.5 { padding-left: 6px; padding-right: 6px; }
  .px-2  { padding-left: 8px;  padding-right: 8px; }
  .px-3  { padding-left: 12px; padding-right: 12px; }
  .px-4  { padding-left: 16px; padding-right: 16px; }
  .py-0\\.5 { padding-top: 2px;  padding-bottom: 2px; }
  .py-2  { padding-top: 8px;   padding-bottom: 8px; }
  .m-0   { margin: 0; }
  .mx-1  { margin-left: 4px; margin-right: 4px; }
  .mr-1  { margin-right: 4px; }
  .mt-1  { margin-top: 4px; }
  .mb-2  { margin-bottom: 8px; }

  /* ── Position ────────────────────────────────────────────── */
  .relative { position: relative; }
  .absolute { position: absolute; }
  .right-0  { right: 0; }
  .top-full { top: 100%; }
  .z-50     { z-index: 50; }
  .overflow-hidden { overflow: hidden; }

  /* ── Colours ─────────────────────────────────────────────── */
  .bg-surface-1   { background-color: var(--color-surface-1); }
  .bg-surface-2   { background-color: var(--color-surface-2); }
  .bg-surface-3   { background-color: var(--color-surface-3); }
  .bg-transparent { background-color: transparent; }
  .bg-accent      { background-color: var(--color-accent); }
  .text-text-primary   { color: var(--color-text-primary); }
  .text-text-secondary { color: var(--color-text-secondary); }
  .text-white { color: #fff; }

  /* ── Borders ─────────────────────────────────────────────── */
  .border   { border-width: 1px; border-style: solid; }
  .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
  .border-none { border: none; }
  .border-border-default { border-color: var(--color-border-default); }
  .border-accent { border-color: var(--color-accent); }
  .rounded      { border-radius: 4px; }
  .rounded-full { border-radius: 9999px; }
  .rounded-lg   { border-radius: 8px; }
  .shadow-lg    { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.2); }

  /* ── Typography ──────────────────────────────────────────── */
  .text-xs      { font-size: 12px; line-height: 16px; }
  .text-sm      { font-size: 14px; line-height: 20px; }
  .font-mono    { font-family: ui-monospace, monospace; }
  .font-semibold { font-weight: 600; }
  .font-bold    { font-weight: 700; }
  .uppercase    { text-transform: uppercase; }
  .tracking-wide { letter-spacing: 0.025em; }
  .outline-none { outline: none; }
  .resize-none  { resize: none; }
  .transition-colors { transition: color 150ms, background-color 150ms, border-color 150ms; }

  /* ── Hover states ────────────────────────────────────────── */
  .hover\\:text-text-primary:hover { color: var(--color-text-primary); }
  .hover\\:bg-surface-2:hover      { background-color: var(--color-surface-2); }

  /* ── Ring (active color swatch outline) ──────────────────── */
  .ring-2.ring-white.ring-offset-1 {
    box-shadow: 0 0 0 1px var(--color-surface-1), 0 0 0 3px #fff;
  }

  /* ── Button base reset (so host-page styles don't bleed) ─── */
  .loupe-annotation-wrap button {
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; border: 1px solid var(--color-border-default);
    background: var(--color-surface-2); color: var(--color-text-primary);
    font-family: inherit; font-size: 14px; line-height: 1;
  }
  .loupe-annotation-wrap button:hover {
    background: var(--color-surface-3);
  }
`;

interface AnnotationCallbacks {
  onSave: (annotations: AnnotationShape[], annotatedDataUrl: string) => void;
  onCancel: () => void;
}

/**
 * Mount a KonvaCanvas annotation step inside the widget's Shadow DOM.
 *
 * Creates a full-screen overlay, renders KonvaCanvas with the provided
 * screenshot, and calls callbacks on save/cancel. React root and DOM nodes
 * are cleaned up after either action.
 */
export function mountAnnotationStep(
  shadow: ShadowRoot,
  screenshotUrl: string,
  callbacks: AnnotationCallbacks
): void {
  // Inject annotation styles into the shadow root
  const styleEl = document.createElement('style');
  styleEl.textContent = ANNOTATION_CSS;
  shadow.appendChild(styleEl);

  // Create full-screen overlay container
  const container = document.createElement('div');
  container.className = 'loupe-annotation-wrap';
  container.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;';
  shadow.appendChild(container);

  const root = createRoot(container);

  function cleanup() {
    root.unmount();
    container.remove();
    styleEl.remove();
  }

  root.render(
    React.createElement(KonvaCanvas, {
      screenshotUrl,
      existingAnnotations: [],
      onSave: (annotations: AnnotationShape[], dataUrl: string) => {
        cleanup();
        callbacks.onSave(annotations, dataUrl);
      },
      onCancel: () => {
        cleanup();
        callbacks.onCancel();
      },
    } as any)
  );
}
