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
`;
