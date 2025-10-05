(() => {
  const EXTENSION_NS = 'lc-assistant';
  let backendBaseUrl = null;
  let latestCodeCache = '';
  let languageCache = '';
  let panelRoot = null;
  let shadowRoot = null;
  let reviewButton = null;
  let timeComplexityButton = null;
  let spaceComplexityButton = null;
  let backButton = null;
  let buttonContainer = null;
  let statusEl = null;
  let outputEl = null;

  function injectPageBridge() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('pageBridge.js');
      script.type = 'module';
      (document.head || document.documentElement).appendChild(script);
      // remove the element node to keep DOM clean; script stays executed
      script.parentNode && script.parentNode.removeChild(script);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[LC Assistant] Failed to inject bridge', e);
    }
  }

  function loadConfig() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get(['EXT_BACKEND_URL'], (data) => {
          backendBaseUrl = data.EXT_BACKEND_URL || 'http://localhost:5055';
          resolve();
        });
      } catch {
        backendBaseUrl = 'http://localhost:5055';
        resolve();
      }
    });
  }

  function togglePanel() {
    if (!panelRoot) return;
    const isHidden = panelRoot.style.display === 'none';
    panelRoot.style.display = isHidden ? 'block' : 'none';
  }

  function ensurePanel() {
    if (panelRoot) return;
    try {
      panelRoot = document.createElement('div');
      panelRoot.id = `${EXTENSION_NS}-panel-root`;
      panelRoot.style.display = 'block'; // Initially visible
      document.documentElement.appendChild(panelRoot);
      shadowRoot = panelRoot.attachShadow({ mode: 'open' });
      console.log('[LC Assistant] Panel root created');
    } catch (error) {
      console.error('[LC Assistant] Panel creation error:', error);
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      :host, .container { all: initial;color:whitesmoke; }
      .container { position: fixed; top: 72px; right: 16px; width: 420px; max-height: 80vh; z-index: 2147483647; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #0f172a; border: 1px solid #e2e8f0; background: #19191C; border-radius: 10px; box-shadow: 0 10px 30px rgba(2,6,23,0.15); display: flex; flex-direction: column; overflow: hidden; }
      .header { display: flex;color:white; align-items: center; justify-content: space-between; padding: 10px 12px;  border-bottom: 1px solid black; }
      .title { font-weight: 600;color:white; font-size: 14px; }
      .btn { appearance: none; border: 1px solid #0ea5e9; background: #0ea5e9; color: white; font-weight: 600; font-size: 11px; padding: 6px 10px; border-radius: 8px; cursor: pointer; margin-left: 4px; transition: all 0.2s ease; }
      .btn:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .btn-secondary { background: #10b981; border-color: #10b981; }
      .btn-tertiary { background: #f59e0b; border-color: #f59e0b; }
      .btn-back { background: #6b7280; border-color: #6b7280; margin-left: 0; }
      .hidden { display: none !important; }
      .body { color:white;padding: 10px 12px; overflow: auto; background: #19191C; }
      .status { background:#19191C;font-size: 12px; color:white; margin-bottom: 6px; }
      .output{height:50%; background: #19191C;}
      .pre { background-color:#19191C !important; color:white !important; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 13px; border: 1px solid #2d2d30; padding: 12px; border-radius: 8px; line-height: 1.6; }
    `;
    shadowRoot.appendChild(style);

    const container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = `
      <div class="header">
        <div class="title">LeetCode Assistant</div>
        <div id="buttonContainer">
          <button class="btn" id="reviewBtn">Review</button>
          <button class="btn btn-secondary" id="timeComplexityBtn">Time</button>
          <button class="btn btn-tertiary" id="spaceComplexityBtn">Space</button>
        </div>
        <button class="btn btn-back hidden" id="backBtn">← Back</button>
      </div>
      <div class="body">
        <div class="status" id="status">Idle</div>
        <div id="output"></div>
      </div>
    `;
    shadowRoot.appendChild(container);
    reviewButton = shadowRoot.getElementById('reviewBtn');
    timeComplexityButton = shadowRoot.getElementById('timeComplexityBtn');
    spaceComplexityButton = shadowRoot.getElementById('spaceComplexityBtn');
    backButton = shadowRoot.getElementById('backBtn');
    buttonContainer = shadowRoot.getElementById('buttonContainer');
    statusEl = shadowRoot.getElementById('status');
    outputEl = shadowRoot.getElementById('output');

    reviewButton.addEventListener('click', async () => {
      setStatus('Capturing code...');
      await captureCode();
      if (!latestCodeCache) {
        setStatus('No code detected.');
        renderOutput('[empty]');
        return;
      }
      await callReview(latestCodeCache, languageCache);
    });

    timeComplexityButton.addEventListener('click', async () => {
      setStatus('Analyzing time complexity...');
      await captureCode();
      if (!latestCodeCache) {
        setStatus('No code detected.');
        renderOutput('[empty]');
        return;
      }
      await callComplexityWithGraph(latestCodeCache, languageCache, 'time');
    });

    spaceComplexityButton.addEventListener('click', async () => {
      setStatus('Analyzing space complexity...');
      await captureCode();
      if (!latestCodeCache) {
        setStatus('No code detected.');
        renderOutput('[empty]');
        return;
      }
      await callComplexityWithGraph(latestCodeCache, languageCache, 'space');
    });

    backButton.addEventListener('click', () => {
      showButtons();
      clearOutput();
      setStatus('Ready');
    });
  }

  function showButtons() {
    buttonContainer.classList.remove('hidden');
    backButton.classList.add('hidden');
  }

  function hideButtons() {
    buttonContainer.classList.add('hidden');
    backButton.classList.remove('hidden');
  }

  function clearOutput() {
    outputEl.innerHTML = '';
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function renderOutput(text) {
    const pre = document.createElement('pre');
    pre.className = 'pre';
    pre.textContent = text || '';
    outputEl.innerHTML = '';
    outputEl.appendChild(pre);
  }

  async function captureCode() {
    latestCodeCache = '';
    languageCache = '';
    return new Promise((resolve) => {
      const results = [];
      let finished = false;

      function finish() {
        if (finished) return;
        finished = true;
        const best = results
          .filter(r => r && r.code && r.code.length)
          .sort((a, b) => b.code.length - a.code.length)[0] || { code: '', language: '' };
        latestCodeCache = best.code || '';
        languageCache = best.language || '';
        resolve();
      }

      function onMsg(ev) {
        const d = ev.data || {};
        if (d.__from === 'lc-assistant-bridge' && d.type === 'code') {
          results.push({ code: d.code || '', language: d.language || '' });
        }
      }

      window.addEventListener('message', onMsg);

      const send = (w) => { try { w.postMessage({ __to: 'lc-assistant-bridge', type: 'getCode' }, '*'); } catch {} };
      // broadcast to top and all iframes
      send(window);
      document.querySelectorAll('iframe').forEach((f) => {
        if (f && f.contentWindow) send(f.contentWindow);
      });

      const t1 = setTimeout(finish, 1200);
      const t2 = setTimeout(finish, 3000);
      const t3 = setTimeout(() => {
        window.removeEventListener('message', onMsg);
        finish();
        clearTimeout(t1); clearTimeout(t2);
      }, 7000);
    });
  }

  async function callReview(code, language) {
    try {
      if (!backendBaseUrl) await loadConfig();
      hideButtons();
      setStatus('Reviewing with Gemini...');
      reviewButton.disabled = true;
      const res = await fetch(`${backendBaseUrl}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderOutput(data.review || 'No review available.');
      setStatus('Review complete.');
    } catch (err) {
      setStatus('Review failed. See console.');
      // eslint-disable-next-line no-console
      console.error('[LeetCode Assistant] Review error', err);
      renderOutput(String(err));
    } finally {
      reviewButton.disabled = false;
    }
  }

  async function callComplexity(code, language) {
    try {
      if (!backendBaseUrl) await loadConfig();
      setStatus('Analyzing complexity...');
      const res = await fetch(`${backendBaseUrl}/api/complexity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderOutput((data.summary || '') + '\n\n' + JSON.stringify(data.complexity || {}, null, 2));
      try {
        window.postMessage({ __to: 'lc-assistant-bridge', type: 'renderGraph', payload: data.complexity }, '*');
      } catch {}
      setStatus('Complexity ready.');
    } catch (err) {
      setStatus('Complexity failed. See console.');
      console.error('[LeetCode Assistant] Complexity error', err);
    }
  }

  async function callComplexityWithGraph(code, language, type = 'time') {
    const isTime = type === 'time';
    const button = isTime ? timeComplexityButton : spaceComplexityButton;

    try {
      if (!backendBaseUrl) await loadConfig();
      hideButtons();
      setStatus(`Analyzing ${type} complexity...`);
      button.disabled = true;
      const res = await fetch(`${backendBaseUrl}/api/complexity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Prefer page hook to render user's graph. If not present, fallback to inline minimal graph.
      outputEl.innerHTML = '';
      let handedToPage = false;
      function onAck(ev){
        const d = ev.data || {};
        if (d.__from === 'lc-assistant-bridge' && d.type === 'renderGraphAck') {
          handedToPage = !!d.handled;
          window.removeEventListener('message', onAck);
        }
      }
      window.addEventListener('message', onAck);
      try {
        if (data && data.complexity) {
          window.postMessage({ __to: 'lc-assistant-bridge', type: 'renderGraph', payload: data.complexity }, '*');
        }
      } catch {}
      // Fallback render inside panel if page did not handle
      setTimeout(() => {
        if (!handedToPage) {
          const complexityValue = isTime ? (data?.complexity?.time || 'O(n)') : (data?.complexity?.space || 'O(1)');
          renderMinimalGraph(complexityValue, type);
        }
      }, 150);
      setStatus('');
    } catch (err) {
      setStatus('Complexity analysis failed. See console.');
      // eslint-disable-next-line no-console
      console.error('[LeetCode Assistant] Complexity error', err);
      outputEl.innerHTML = '';
    } finally {
      button.disabled = false;
    }
  }

  function renderMinimalGraph(complexityValue, complexityType = 'time') {
    // Create iframe to load the React graph component
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 100%; height: 340px; border: none; border-radius: 0; background: #19191C; display: block; margin: 0;';
    iframe.src = 'http://localhost:5055'; // Server serving React app

    outputEl.appendChild(iframe);

    // Send complexity data to iframe once loaded
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.postMessage({
          type: 'updateComplexity',
          complexityData: {
            time: complexityType === 'time' ? complexityValue : 'O(n)',
            space: complexityType === 'space' ? complexityValue : 'O(1)'
          },
          complexityType: complexityType
        }, '*');
      }, 500);
    };
  }


  function observeSubmit() {
    const tryBind = () => {
      const btn = document.querySelector('[data-cy="submit-code-btn"]');
      if (btn && !btn.__lcAssistantBound) {
        btn.__lcAssistantBound = true;
        btn.addEventListener('click', () => {
          setTimeout(async () => {
            await captureCode();
            if (latestCodeCache) await callComplexity(latestCodeCache, languageCache);
          }, 1200);
        });
      }
    };
    tryBind();
    const mo = new MutationObserver(tryBind);
    mo.observe(document.documentElement, { subtree: true, childList: true });
  }

  function setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Ctrl + ` (backtick)
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        togglePanel();
      }
    });
  }

  async function init() {
    try {
      console.log('[LC Assistant] Initializing...');
      await loadConfig();
      injectPageBridge();
      ensurePanel();
      observeSubmit();
      setupKeyboardShortcut();
      console.log('[LC Assistant] Panel created, buttons:', !!reviewButton, !!timeComplexityButton, !!spaceComplexityButton);
      console.log('[LC Assistant] Press Ctrl+` to toggle panel');
      // Attempt an initial auto-capture shortly after loading
      // Initial passive capture (optional):
      setTimeout(async () => {
        await captureCode();
        if (latestCodeCache) {
          setStatus('Ready');
        }
      }, 1000);
    } catch (error) {
      console.error('[LC Assistant] Init error:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();


