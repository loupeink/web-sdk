import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitFeedback } from './submit';

describe('submitFeedback (SDK-04)', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
  });

  it('calls fetch with POST method and X-API-Key header', async () => {
    await submitFeedback({
      apiKey: 'lp_test',
      edgeFunctionUrl: 'https://example.com/fn',
      comment: 'test',
      severity: 'minor',
      screenshotDataUrl: null,
      context: {
        url: '',
        title: '',
        viewportWidth: 0,
        viewportHeight: 0,
        userAgent: '',
        capturedAt: '',
      },
    });

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://example.com/fn');
    expect(options.method).toBe('POST');
    expect(options.headers['X-API-Key']).toBe('lp_test');
  });
});
