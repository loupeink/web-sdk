export const WIDGET_CSS = `
  .loupe-btn {
    position: fixed;
    z-index: 2147483647;
    background-color: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    padding: 8px 16px;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .loupe-btn:hover {
    opacity: 0.9;
  }

  .loupe-btn--loading {
    pointer-events: none;
    min-width: 40px;
    min-height: 36px;
  }

  .loupe-btn--loading::after {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    margin: 0 auto;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: loupe-spin 0.6s linear infinite;
  }

  @keyframes loupe-spin {
    to { transform: rotate(360deg); }
  }

  .bottom-right {
    bottom: 24px;
    right: 24px;
  }

  .bottom-left {
    bottom: 24px;
    left: 24px;
  }

  .top-right {
    top: 24px;
    right: 24px;
  }

  .top-left {
    top: 24px;
    left: 24px;
  }

  .loupe-modal {
    display: none;
    position: fixed;
    z-index: 2147483646;
    bottom: 80px;
    right: 24px;
    background: #18181b;
    border: 1px solid #3f3f46;
    border-radius: 12px;
    padding: 24px;
    min-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    font-family: system-ui, -apple-system, sans-serif;
    color: #f4f4f5;
  }

  .loupe-modal.modal--visible {
    display: block;
  }

  .loupe-modal textarea {
    width: 100%;
    box-sizing: border-box;
    background: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 6px;
    color: #f4f4f5;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 8px;
    margin-bottom: 12px;
    resize: vertical;
  }

  .loupe-modal select {
    width: 100%;
    box-sizing: border-box;
    background: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 6px;
    color: #f4f4f5;
    font-size: 14px;
    padding: 8px;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .loupe-modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-bottom: 0;
  }

  .loupe-branding {
    display: block;
    text-align: center;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #27272a;
    font-size: 11px;
    color: #52525b;
    text-decoration: none;
    letter-spacing: 0.01em;
  }

  .loupe-branding:hover {
    color: #34d399;
  }

  .loupe-modal-submit {
    background: #10b981;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
  }

  .loupe-modal-cancel {
    background: transparent;
    color: #a1a1aa;
    border: 1px solid #3f3f46;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
  }

  .loupe-toast {
    position: fixed;
    z-index: 2147483647;
    bottom: 80px;
    right: 24px;
    background: #18181b;
    border: 1px solid #3f3f46;
    border-radius: 10px;
    padding: 14px 18px;
    font-family: system-ui, -apple-system, sans-serif;
    color: #f4f4f5;
    font-size: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: loupe-toast-in 0.25s ease-out;
  }

  .loupe-toast.toast--out {
    animation: loupe-toast-out 0.2s ease-in forwards;
  }

  .loupe-toast a {
    color: #34d399;
    text-decoration: none;
    font-weight: 500;
  }

  .loupe-toast a:hover {
    text-decoration: underline;
  }

  @keyframes loupe-toast-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes loupe-toast-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(8px); }
  }
`;
