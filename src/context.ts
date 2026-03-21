export interface PageContext {
  url: string;
  title: string;
  viewportWidth: number;
  viewportHeight: number;
  userAgent: string;
  capturedAt: string;
}

export function capturePageContext(): PageContext {
  return {
    url: window.location.href,
    title: document.title,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    capturedAt: new Date().toISOString(),
  };
}
