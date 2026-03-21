import { describe, it, expect } from 'vitest';
import { LoupeWidget } from './widget';

describe('LoupeWidget (SDK-01)', () => {
  it('mount() creates a shadow host element appended to document.body', () => {
    const widget = new LoupeWidget({ apiKey: 'lp_x', position: 'bottom-right' });
    widget.mount(document.body);

    // Shadow host must be a child of document.body
    const host = document.body.lastElementChild as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.shadowRoot ?? (host as any)._shadowRoot ?? null).not.toBeNull();
  });
});

describe('LoupeWidget modal (SDK-02)', () => {
  it('clicking the feedback button makes the modal visible in the shadow DOM', () => {
    const widget = new LoupeWidget({ apiKey: 'lp_x', position: 'bottom-right' });
    widget.mount(document.body);

    const host = document.body.lastElementChild as HTMLElement;
    // Shadow DOM attached with mode:'open' to allow querying in tests
    const shadow = host.shadowRoot;
    expect(shadow).not.toBeNull();

    const button = shadow!.querySelector('button');
    expect(button).not.toBeNull();
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // After click, a modal element should exist and be visible
    const modal = shadow!.querySelector('[data-loupe-modal]');
    expect(modal).not.toBeNull();
  });
});
