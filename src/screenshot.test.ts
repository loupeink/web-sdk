import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureScreenshot } from './screenshot';

describe('captureScreenshot (SDK-02)', () => {
  let mockHostEl: HTMLElement;

  beforeEach(() => {
    mockHostEl = document.createElement('div');
    mockHostEl.style.display = 'block';
    document.body.appendChild(mockHostEl);

    // Mock getDisplayMedia
    const mockTrack = { stop: vi.fn() };
    const mockStream = { getVideoTracks: () => [mockTrack] };
    const mockBitmap = {
      width: 800,
      height: 600,
      close: vi.fn(),
    };

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getDisplayMedia: vi.fn().mockResolvedValue(mockStream),
      },
      writable: true,
      configurable: true,
    });

    // Mock ImageCapture
    (globalThis as any).ImageCapture = vi.fn().mockImplementation(() => ({
      grabFrame: vi.fn().mockResolvedValue(mockBitmap),
    }));

    // Mock canvas
    const mockCtx = { drawImage: vi.fn() };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx) as any;
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,abc');
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

  it('restores widget host element display even if getDisplayMedia throws', async () => {
    (navigator.mediaDevices.getDisplayMedia as any).mockRejectedValueOnce(new Error('denied'));
    await expect(captureScreenshot(mockHostEl)).rejects.toThrow('denied');
    expect(mockHostEl.style.display).toBe('');
  });
});
