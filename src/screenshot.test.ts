import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureScreenshot } from './screenshot';

// Mock html2canvas-pro before any import resolution
vi.mock('html2canvas-pro', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,abc',
  }),
}));

describe('captureScreenshot (SDK-02)', () => {
  let mockHostEl: HTMLElement;

  beforeEach(() => {
    mockHostEl = document.createElement('div');
    mockHostEl.style.display = 'block';
    document.body.appendChild(mockHostEl);
  });

  it('returns a data URL string starting with "data:"', async () => {
    const result = await captureScreenshot(mockHostEl);
    expect(result).toBeTruthy();
    expect(result!.startsWith('data:')).toBe(true);
  });

  it('restores widget host element display to "" after capture', async () => {
    await captureScreenshot(mockHostEl);
    expect(mockHostEl.style.display).toBe('');
  });

  it('restores widget host element display even if html2canvas throws', async () => {
    const html2canvas = (await import('html2canvas-pro')).default as ReturnType<typeof vi.fn>;
    html2canvas.mockRejectedValueOnce(new Error('capture failed'));
    await expect(captureScreenshot(mockHostEl)).rejects.toThrow('capture failed');
    expect(mockHostEl.style.display).toBe('');
  });
});
