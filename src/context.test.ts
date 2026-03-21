import { describe, it, expect } from 'vitest';
import { capturePageContext } from './context';

describe('capturePageContext (SDK-03)', () => {
  it('returns an object with url, title, viewportWidth, viewportHeight, userAgent, capturedAt', () => {
    const ctx = capturePageContext();

    expect(typeof ctx.url).toBe('string');
    expect(typeof ctx.title).toBe('string');
    expect(typeof ctx.viewportWidth).toBe('number');
    expect(typeof ctx.viewportHeight).toBe('number');
    expect(typeof ctx.userAgent).toBe('string');
    expect(typeof ctx.capturedAt).toBe('string');
    // capturedAt must be a valid ISO string
    expect(() => new Date(ctx.capturedAt).toISOString()).not.toThrow();
  });
});
