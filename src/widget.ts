import { WIDGET_CSS } from './styles';
import { captureScreenshot } from './screenshot';
import { capturePageContext } from './context';
import { submitFeedback } from './submit';
import { mountAnnotationStep } from './annotation-step';
import { version } from '../package.json';

export interface LoupeWidgetConfig {
  apiKey: string;
  edgeFunctionUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
  buttonLabel?: string;
  buttonHtml?: string;
  /** Hide "Powered by Loupe" branding (available on Pro & Team plans) */
  hideBranding?: boolean;
  /** Delay in ms before the widget button appears after mount() is called */
  showDelayMs?: number;
  /** Pixel offset from the edges of the viewport */
  offset?: { x?: number; y?: number };
  /** Color theme for the modal. 'auto' follows system preference. */
  theme?: 'light' | 'dark' | 'auto';
  /** CSS z-index for the widget button. Modal gets zIndex-1. */
  zIndex?: number;
  /** Set to false to skip screenshot capture and annotation step */
  screenshotEnabled?: boolean;
  /** Pre-selected severity in the dropdown */
  defaultSeverity?: 'critical' | 'major' | 'minor' | 'suggestion';
  /** Custom toast message when there is no github_issue_url */
  successMessage?: string;
  /** Show a public-posting privacy warning in the modal */
  publicWarning?: 'github' | 'linear' | 'both';
  /** Called after successful submission */
  onSubmit?: (result: { id: string; url?: string; github_issue_url?: string }) => void;
  /** Strip query params from the page URL captured in context */
  stripUrlParams?: boolean;
}

type ResolvedConfig = LoupeWidgetConfig & {
  edgeFunctionUrl: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color: string;
  buttonLabel: string;
  buttonHtml: string;
  hideBranding: boolean;
  showDelayMs: number;
  offset: { x: number; y: number };
  theme: 'light' | 'dark' | 'auto';
  zIndex: number;
  screenshotEnabled: boolean;
  defaultSeverity: 'critical' | 'major' | 'minor' | 'suggestion';
  successMessage: string;
  stripUrlParams: boolean;
};

export class LoupeWidget {
  private config: ResolvedConfig;
  private hostEl: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private button: HTMLButtonElement | null = null;
  private modal: HTMLDivElement | null = null;

  constructor(config: LoupeWidgetConfig) {
    this.config = {
      apiKey: config.apiKey,
      edgeFunctionUrl: config.edgeFunctionUrl ?? 'https://etdekhjnkevmrkgqixow.supabase.co/functions/v1/submit-sdk-feedback',
      position: config.position ?? 'bottom-right',
      color: config.color ?? '#10b981',
      buttonLabel: config.buttonLabel ?? 'Feedback',
      buttonHtml: config.buttonHtml ?? '',
      hideBranding: config.hideBranding ?? false,
      showDelayMs: config.showDelayMs ?? 0,
      offset: { x: config.offset?.x ?? 24, y: config.offset?.y ?? 24 },
      theme: config.theme ?? 'dark',
      zIndex: config.zIndex ?? 2147483647,
      screenshotEnabled: config.screenshotEnabled ?? true,
      defaultSeverity: config.defaultSeverity ?? 'minor',
      successMessage: config.successMessage ?? '',
      publicWarning: config.publicWarning,
      onSubmit: config.onSubmit,
      stripUrlParams: config.stripUrlParams ?? false,
    };
  }

  mount(container: HTMLElement): void {
    if (this.config.showDelayMs > 0) {
      setTimeout(() => this._doMount(container), this.config.showDelayMs);
    } else {
      this._doMount(container);
    }
  }

  private _doMount(container: HTMLElement): void {
    console.log(`[Loupe] web-sdk v${version}`);

    // Create shadow host
    this.hostEl = document.createElement('div');
    this.hostEl.id = 'loupe-widget-host';

    // Attach open shadow DOM (open mode allows test querying via shadowRoot)
    this.shadow = this.hostEl.attachShadow({ mode: 'open' });

    // Inject styles
    const style = document.createElement('style');
    style.textContent = WIDGET_CSS;
    this.shadow.appendChild(style);

    const pos = this.config.position;
    const ox = this.config.offset.x;
    const oy = this.config.offset.y;
    const zIdx = this.config.zIndex;
    const isBottom = pos.startsWith('bottom');
    const isRight = pos.endsWith('right');
    const BUTTON_HEIGHT = 56; // button height + gap

    // Create feedback button
    const button = document.createElement('button');
    button.className = 'loupe-btn';

    // Apply position inline (overrides removed CSS position classes)
    Object.assign(button.style, {
      [isBottom ? 'bottom' : 'top']: `${oy}px`,
      [isRight ? 'right' : 'left']: `${ox}px`,
      zIndex: String(zIdx),
    });

    if (this.config.color) {
      button.style.backgroundColor = this.config.color;
    }

    // Button content
    if (this.config.buttonHtml) {
      button.innerHTML = this.config.buttonHtml;
    } else {
      button.textContent = this.config.buttonLabel;
    }

    // Create modal
    const modal = document.createElement('div') as HTMLDivElement;
    modal.className = `loupe-modal loupe-theme--${this.config.theme}`;
    modal.setAttribute('data-loupe-modal', '');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    // Position modal to appear above/below button from the same side
    Object.assign(modal.style, {
      [isBottom ? 'bottom' : 'top']: `${oy + BUTTON_HEIGHT}px`,
      [isRight ? 'right' : 'left']: `${ox}px`,
      zIndex: String(zIdx - 1),
    });

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Describe the issue...';
    textarea.rows = 4;

    const piiNote = document.createElement('p');
    piiNote.className = 'loupe-pii-note';
    piiNote.textContent = 'Screenshots may include sensitive information visible on screen.';

    const select = document.createElement('select');
    const severities: Array<'critical' | 'major' | 'minor' | 'suggestion'> = ['critical', 'major', 'minor', 'suggestion'];
    for (const s of severities) {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      select.appendChild(opt);
    }
    select.value = this.config.defaultSeverity;

    const actions = document.createElement('div');
    actions.className = 'loupe-modal-actions';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'loupe-modal-submit';
    submitBtn.textContent = 'Send Feedback';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'loupe-modal-cancel';
    cancelBtn.textContent = 'Cancel';

    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);

    // Modal assembly: textarea → piiNote → select → [publicWarning if set] → actions → [branding if not hidden]
    modal.appendChild(textarea);
    modal.appendChild(piiNote);
    modal.appendChild(select);

    if (this.config.publicWarning) {
      const warn = document.createElement('p');
      warn.className = 'loupe-public-warn';
      const target = this.config.publicWarning === 'both'
        ? 'GitHub and Linear'
        : this.config.publicWarning === 'github' ? 'GitHub (public repo)' : 'Linear';
      warn.textContent = `Note: Your feedback will be posted to ${target}. Avoid sharing passwords or private data.`;
      modal.appendChild(warn);
    }

    modal.appendChild(actions);

    if (!this.config.hideBranding) {
      const branding = document.createElement('a');
      branding.className = 'loupe-branding';
      branding.href = 'https://loupe.ink?ref=widget';
      branding.target = '_blank';
      branding.rel = 'noopener noreferrer';
      branding.textContent = 'Powered by Loupe';
      modal.appendChild(branding);
    }

    // Append elements to shadow
    this.shadow.appendChild(button);
    this.shadow.appendChild(modal);

    // Store as instance properties for programmatic API
    this.button = button;
    this.modal = modal;

    // Append host to container
    container.appendChild(this.hostEl);

    // Wire up button click — toggle modal visibility
    button.addEventListener('click', () => {
      modal.classList.toggle('modal--visible');
    });

    // Wire up cancel
    cancelBtn.addEventListener('click', () => {
      modal.classList.remove('modal--visible');
    });

    // Wire up submit
    submitBtn.addEventListener('click', async () => {
      const comment = textarea.value.trim();
      const severity = select.value as 'critical' | 'major' | 'minor' | 'suggestion';
      const originalLabel = submitBtn.textContent;
      submitBtn.setAttribute('disabled', '');

      if (!this.config.screenshotEnabled) {
        // Direct submit without screenshot or annotation
        submitBtn.textContent = 'Sending...';
        modal.classList.remove('modal--visible');
        button.classList.add('loupe-btn--loading');
        if (this.config.buttonHtml) button.innerHTML = ''; else button.textContent = '';
        button.setAttribute('disabled', '');

        const context = capturePageContext();
        if (this.config.stripUrlParams && context.url) {
          context.url = context.url.replace(/\?.*$/, '');
        }
        try {
          const result = await submitFeedback({
            apiKey: this.config.apiKey,
            edgeFunctionUrl: this.config.edgeFunctionUrl,
            comment,
            severity,
            screenshotDataUrl: null,
            context,
          });
          textarea.value = '';
          this.config.onSubmit?.(result);
          this.showToast(result.github_issue_url);
        } catch {
          alert('Failed to send feedback. Please try again.');
        } finally {
          button.classList.remove('loupe-btn--loading');
          if (this.config.buttonHtml) button.innerHTML = this.config.buttonHtml; else button.textContent = this.config.buttonLabel;
          button.removeAttribute('disabled');
          submitBtn.textContent = originalLabel;
          submitBtn.removeAttribute('disabled');
        }
        return;
      }

      // Screenshot + annotation path
      submitBtn.textContent = 'Capturing...';
      try {
        // 1. Take screenshot of the page
        const rawDataUrl = await captureScreenshot(this.hostEl!).catch(() => null);

        // 2. Hide the modal while annotation canvas is open
        modal.classList.remove('modal--visible');

        // 3. Open annotation step inside the shadow DOM
        mountAnnotationStep(this.shadow!, rawDataUrl ?? '', {
          onSave: async (_annotations, annotatedDataUrl) => {
            // 4. Show loader on feedback button during upload
            button.classList.add('loupe-btn--loading');
            if (this.config.buttonHtml) button.innerHTML = ''; else button.textContent = '';
            button.setAttribute('disabled', '');

            // 5. Submit with annotated screenshot
            const context = capturePageContext();
            if (this.config.stripUrlParams && context.url) {
              context.url = context.url.replace(/\?.*$/, '');
            }
            try {
              const result = await submitFeedback({
                apiKey: this.config.apiKey,
                edgeFunctionUrl: this.config.edgeFunctionUrl,
                comment,
                severity,
                screenshotDataUrl: annotatedDataUrl,
                context,
              });
              textarea.value = '';
              this.config.onSubmit?.(result);
              this.showToast(result.github_issue_url);
            } catch {
              alert('Failed to send feedback. Please try again.');
            } finally {
              button.classList.remove('loupe-btn--loading');
              if (this.config.buttonHtml) button.innerHTML = this.config.buttonHtml; else button.textContent = this.config.buttonLabel;
              button.removeAttribute('disabled');
              submitBtn.textContent = originalLabel;
              submitBtn.removeAttribute('disabled');
            }
          },
          onCancel: () => {
            // User cancelled annotation — restore modal
            modal.classList.add('modal--visible');
            submitBtn.textContent = originalLabel;
            submitBtn.removeAttribute('disabled');
          },
        });
      } catch {
        alert('Failed to capture screenshot. Please try again.');
        submitBtn.textContent = originalLabel;
        submitBtn.removeAttribute('disabled');
      }
    });
  }

  /** Programmatically open the feedback modal */
  open(): void {
    this.modal?.classList.add('modal--visible');
  }

  /** Programmatically close the feedback modal */
  close(): void {
    this.modal?.classList.remove('modal--visible');
  }

  /** Programmatically toggle the feedback modal */
  toggle(): void {
    this.modal?.classList.toggle('modal--visible');
  }

  private showToast(githubIssueUrl?: string): void {
    if (!this.shadow) return;

    const toast = document.createElement('div');
    toast.className = 'loupe-toast';

    // Position toast near button using same corner as button
    const pos = this.config.position;
    const ox = this.config.offset.x;
    const oy = this.config.offset.y;
    const isBottom = pos.startsWith('bottom');
    const isRight = pos.endsWith('right');
    Object.assign(toast.style, {
      [isBottom ? 'bottom' : 'top']: `${oy + 56}px`,
      [isRight ? 'right' : 'left']: `${ox}px`,
      zIndex: String(this.config.zIndex),
    });

    if (githubIssueUrl) {
      toast.innerHTML = 'Feedback sent. <a href="' + githubIssueUrl + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">View GitHub issue</a>';
    } else {
      toast.textContent = this.config.successMessage || 'Feedback sent. Thank you!';
    }
    this.shadow.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast--out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
  }

  destroy(): void {
    this.hostEl?.remove();
    this.hostEl = null;
    this.shadow = null;
    this.button = null;
    this.modal = null;
  }
}
