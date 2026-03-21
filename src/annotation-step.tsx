import React from 'react';
import { createRoot } from 'react-dom/client';
import { KonvaCanvas } from '@loupe/ui';
import type { AnnotationShape } from '@loupe/ui';

// Minimal CSS to style the KonvaToolbar inside Shadow DOM.
// Tailwind classes do not apply inside Shadow DOM — the host page's Tailwind
// stylesheet is in the main document; Shadow DOM is isolated. We inject a
// minimal scoped stylesheet for the toolbar buttons so they are usable.
// Trade-off: this duplicates a subset of Tailwind utilities hardcoded here.
// A full Tailwind stylesheet (~10KB min) would be heavier — minimal CSS wins.
const ANNOTATION_CSS = `
  .loupe-annotation-wrap button {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 4px 8px; border-radius: 6px; font-size: 13px; cursor: pointer;
    background: #27272a; color: #e4e4e7; border: 1px solid #3f3f46;
  }
  .loupe-annotation-wrap button:hover { background: #3f3f46; }
  .loupe-annotation-wrap button[aria-pressed="true"],
  .loupe-annotation-wrap button.active { background: #10b981; color: #fff; }
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
    'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;';
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
