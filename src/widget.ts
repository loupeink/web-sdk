import { WIDGET_CSS } from './styles';
import { captureScreenshot } from './screenshot';
import { capturePageContext } from './context';
import { submitFeedback } from './submit';
import { mountAnnotationStep } from './annotation-step';

export interface LoupeWidgetConfig {
  apiKey: string;
  edgeFunctionUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
  buttonLabel?: string;
}

export class LoupeWidget {
  private config: Required<LoupeWidgetConfig>;
  private hostEl: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;

  constructor(config: LoupeWidgetConfig) {
    this.config = {
      apiKey: config.apiKey,
      edgeFunctionUrl: config.edgeFunctionUrl ?? 'https://etdekhjnkevmrkgqixow.supabase.co/functions/v1/submit-sdk-feedback',
      position: config.position ?? 'bottom-right',
      color: config.color ?? '#10b981',
      buttonLabel: config.buttonLabel ?? 'Feedback',
    };
  }

  mount(container: HTMLElement): void {
    // Create shadow host
    this.hostEl = document.createElement('div');
    this.hostEl.id = 'loupe-widget-host';

    // Attach open shadow DOM (open mode allows test querying via shadowRoot)
    this.shadow = this.hostEl.attachShadow({ mode: 'open' });

    // Inject styles
    const style = document.createElement('style');
    style.textContent = WIDGET_CSS;
    this.shadow.appendChild(style);

    // Create feedback button
    const button = document.createElement('button');
    button.className = `loupe-btn ${this.config.position}`;
    button.textContent = this.config.buttonLabel;
    if (this.config.color) {
      button.style.backgroundColor = this.config.color;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'loupe-modal';
    modal.setAttribute('data-loupe-modal', '');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Describe the issue...';
    textarea.rows = 4;

    const select = document.createElement('select');
    const severities: Array<'critical' | 'major' | 'minor' | 'suggestion'> = ['critical', 'major', 'minor', 'suggestion'];
    for (const s of severities) {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      select.appendChild(opt);
    }

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

    modal.appendChild(textarea);
    modal.appendChild(select);
    modal.appendChild(actions);

    // Append elements to shadow
    this.shadow.appendChild(button);
    this.shadow.appendChild(modal);

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
      submitBtn.textContent = 'Capturing...';
      submitBtn.setAttribute('disabled', '');

      try {
        // 1. Take screenshot of the page
        const rawDataUrl = await captureScreenshot(this.hostEl!).catch(() => null);

        // 2. Hide the modal while annotation canvas is open
        modal.classList.remove('modal--visible');

        // 3. Open annotation step inside the shadow DOM
        mountAnnotationStep(this.shadow!, rawDataUrl ?? '', {
          onSave: async (_annotations, annotatedDataUrl) => {
            // 4. Submit with annotated screenshot
            const context = capturePageContext();
            try {
              await submitFeedback({
                apiKey: this.config.apiKey,
                edgeFunctionUrl: this.config.edgeFunctionUrl,
                comment,
                severity,
                screenshotDataUrl: annotatedDataUrl,
                context,
              });
              textarea.value = '';
            } catch {
              alert('Failed to send feedback. Please try again.');
            } finally {
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

  destroy(): void {
    this.hostEl?.remove();
    this.hostEl = null;
    this.shadow = null;
  }
}
