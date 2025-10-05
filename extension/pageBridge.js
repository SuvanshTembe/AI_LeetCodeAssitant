// This script runs in the page context to access Monaco APIs and page functions.
(function () {
  function readFromEditors() {
    try {
      const getEditors = window.monaco?.editor?.getEditors?.bind(window.monaco?.editor);
      if (!getEditors) return null;
      const editors = getEditors();
      for (const ed of editors) {
        const model = ed?.getModel?.();
        const code = model?.getValue?.() || '';
        if (code) {
          const lang =
            (window.monaco?.editor?.getModelLanguage && model && window.monaco.editor.getModelLanguage(model)) ||
            model?.getLanguageId?.() ||
            model?._languageIdentifier?.language ||
            '';
          return { code, language: lang };
        }
      }
    } catch {}
    return null;
  }

  function readFromModels() {
    try {
      const models = window.monaco?.editor?.getModels?.() || [];
      for (const m of models) {
        const code = m?.getValue?.() || '';
        if (code) {
          const lang =
            (window.monaco?.editor?.getModelLanguage && window.monaco.editor.getModelLanguage(m)) ||
            m?.getLanguageId?.() ||
            m?._languageIdentifier?.language ||
            '';
          return { code, language: lang };
        }
      }
    } catch {}
    return null;
  }

  function readFromDom() {
    try {
      const lines = Array.from(document.querySelectorAll('.monaco-editor .view-lines .view-line'));
      if (!lines.length) return null;
      const code = lines.map(div => (div?.innerText ?? '')).join('\n').trim();
      if (!code) return null;
      const langBtn = document.querySelector('[data-cy="lang-select"], [data-cy="lang-select-button"]');
      const language = langBtn?.innerText?.trim?.() || '';
      return { code, language };
    } catch {}
    return null;
  }

  async function getCodeWithRetry(maxTries = 12, delayMs = 250) {
    for (let i = 0; i < maxTries; i++) {
      const a = readFromEditors(); if (a?.code) return a;
      const b = readFromModels();  if (b?.code) return b;
      const c = readFromDom();     if (c?.code) return c;
      await new Promise(r => setTimeout(r, delayMs));
    }
    return { code: '', language: '' };
  }

  window.addEventListener('message', async (ev) => {
    const data = ev.data || {};
    if (data.__to !== 'lc-assistant-bridge') return;
    if (data.type === 'getCode') {
      const { code, language } = await getCodeWithRetry();
      window.postMessage({ __from: 'lc-assistant-bridge', type: 'code', code, language }, '*');
    }
    if (data.type === 'renderGraph') {
      try {
        let handled = false;
        if (typeof window.renderComplexityGraph === 'function') {
          window.renderComplexityGraph(data.payload);
          handled = true;
        } else if (window.leetGraph && typeof window.leetGraph.renderComplexity === 'function') {
          window.leetGraph.renderComplexity(data.payload);
          handled = true;
        }
        window.postMessage({ __from: 'lc-assistant-bridge', type: 'renderGraphAck', handled }, '*');
      } catch (_) {
        window.postMessage({ __from: 'lc-assistant-bridge', type: 'renderGraphAck', handled: false }, '*');
      }
    }
  });
})();


