import html2canvas from 'html2canvas-pro';

export async function captureScreenshot(widgetHostEl: HTMLElement): Promise<string> {
  widgetHostEl.style.display = 'none';
  try {
    const canvas = await html2canvas(document.documentElement, {
      useCORS: true,
      allowTaint: false,
      logging: false,
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally {
    widgetHostEl.style.display = '';
  }
}
