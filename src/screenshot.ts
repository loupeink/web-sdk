declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  grabFrame(): Promise<ImageBitmap>;
}

export async function captureScreenshot(widgetHostEl: HTMLElement): Promise<string> {
  widgetHostEl.style.display = 'none';
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser' } as MediaTrackConstraints,
      preferCurrentTab: true,
    } as DisplayMediaStreamOptions);

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const bitmap = await imageCapture.grabFrame();
    track.stop();

    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    widgetHostEl.style.display = '';
  }
}
