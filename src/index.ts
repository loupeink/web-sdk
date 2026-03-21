import { LoupeWidget, type LoupeWidgetConfig } from './widget';

export { LoupeWidget };
export type { LoupeWidgetConfig };
export { capturePageContext } from './context';
export { submitFeedback } from './submit';
export { captureScreenshot } from './screenshot';

let currentWidget: LoupeWidget | null = null;

export function init(config: LoupeWidgetConfig): void {
  currentWidget = new LoupeWidget(config);
  currentWidget.mount(document.body);
}

export function destroy(): void {
  currentWidget?.destroy();
  currentWidget = null;
}
