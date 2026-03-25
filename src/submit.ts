import type { PageContext } from './context';

export interface SubmitFeedbackOpts {
  apiKey: string;
  edgeFunctionUrl: string;
  comment: string;
  severity: 'critical' | 'major' | 'minor' | 'suggestion';
  screenshotDataUrl: string | null;
  context: PageContext;
}

export interface SubmitFeedbackResult {
  ok: boolean;
  id: string;
  url: string;
}

export async function submitFeedback(opts: SubmitFeedbackOpts): Promise<SubmitFeedbackResult> {
  const response = await fetch(opts.edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': opts.apiKey,
    },
    body: JSON.stringify({
      comment: opts.comment,
      severity: opts.severity,
      screenshot: opts.screenshotDataUrl,
      context: opts.context,
    }),
  });

  if (!response.ok) {
    throw new Error('Submit failed: ' + response.status);
  }

  return response.json();
}
