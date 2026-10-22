// Loop helpers for browser-driving agents (v2).
// Inject once per page load with the Claude in Chrome javascript tool (paste this whole file as the code).
//
// Primary path ("editor API"): finds the Loop editor that is already running on the open page and calls its own
// content methods (getMarkdown / appendHtml / setHtml). Loop itself then syncs the change exactly as if
// the user had typed it. Nothing here reads cookies, web storage or tokens, or makes network requests.
//
// Fallback path ("clipboard"): stage/beginCapture move Markdown through the user's clipboard with real keystrokes,
// for when the editor API can't be found (e.g. after a Loop update).
(() => {
  const H = (window.__loopAgent = window.__loopAgent || {});
  H.version = 2;

  // ---------- editor API ----------
  const isEditor = (v) => {
    try {
      return !!v && typeof v.getMarkdown === 'function' && typeof v.appendHtml === 'function';
    } catch (e) {
      return false;
    }
  };
  const editorFor = (node) => {
    let found = null;
    const look = (v, d) => {
      if (found || !v || typeof v !== 'object' || d > 3) return;
      if (isEditor(v)) {
        found = v;
        return;
      }
      for (const k of ['defaultView', 'hostComponentFocusable', 'scriptorComponent']) {
        let x;
        try {
          x = v[k];
        } catch (e) {
          continue;
        }
        if (x) look(x, d + 1);
      }
    };
    let el = node;
    let key;
    while (el && !(key = Object.keys(el).find((k) => k.startsWith('__reactFiber')))) el = el.parentElement;
    for (let f = el && el[key], i = 0; f && i < 25 && !found; f = f.return, i++) {
      const p = f.memoizedProps;
      if (p && typeof p === 'object') {
        for (const k of Object.keys(p)) {
          let v;
          try {
            v = p[k];
          } catch (e) {
            continue;
          }
          look(v, 0);
        }
      }
    }
    return found;
  };
  const region = (label) =>
    [...document.querySelectorAll('[contenteditable="true"][role="textbox"]')].find(
      (n) => n.getAttribute('aria-label') === label && !n.closest('table, [role="grid"]'),
    );

  // Locate the page's title and body editors. Call after every navigation to another page.
  H.locate = () => {
    const bodyNode = region('Canvas');
    const titleNode = region('Title');
    H.body = bodyNode ? editorFor(bodyNode) : null;
    H.title = titleNode ? editorFor(titleNode) : null;
    return H.body ? `editor API ready (title: ${H.title ? 'yes' : 'no'})` : 'editor API not found: use the clipboard fallback';
  };
  const need = () => {
    if (!H.body) H.locate();
    if (!H.body) throw new Error('editor API not found: use the clipboard fallback');
    return H.body;
  };
  const settle = (ms = 800) => new Promise((r) => setTimeout(r, ms));

  // READ: whole page body as Markdown into H.captured; returns a size summary. Fetch with H.chunk(i).
  H.read = async () => {
    H.captured = await need().getMarkdown();
    const t = H.title ? await H.title.getMarkdown() : '';
    H.pageTitle = t.trim();
    return `title: ${H.pageTitle || '(unknown)'} | ${H.info()}`;
  };

  // WRITE: Loop converts the HTML into native blocks (see reference/html.md). Each returns a before/after summary.
  const write = async (fn) => {
    const ed = need();
    const before = (await ed.getMarkdown()).length;
    await fn(ed);
    await settle();
    const after = await ed.getMarkdown();
    H.captured = after;
    return `ok: body ${before} -> ${after.length} chars`;
  };
  H.append = (html) => write((ed) => ed.appendHtml(String(html)));
  // Replaces the WHOLE page body. Only with the user's explicit confirmation.
  H.replaceAll = (html) => write((ed) => ed.setHtml(String(html)));

  // ---------- shared read buffer ----------
  H.info = (size = 800) =>
    H.captured == null ? 'nothing captured' : `${H.captured.length} chars in ${Math.ceil(H.captured.length / size)} chunk(s) of ${size}`;
  H.chunk = (i, size = 800) => (H.captured == null ? '' : H.captured.slice(i * size, (i + 1) * size));

  // ---------- clipboard fallback ----------
  const box = (id) => {
    document.getElementById(id)?.remove();
    const ta = document.createElement('textarea');
    ta.id = id;
    ta.setAttribute('aria-hidden', 'true');
    Object.assign(ta.style, { position: 'fixed', top: '0', left: '0', width: '2px', height: '2px', opacity: '0.01', zIndex: '2147483647' });
    document.body.appendChild(ta);
    return ta;
  };
  // WRITE fallback: stage(md) → press ctrl+c → unstage() → click insertion point → press ctrl+v.
  H.stage = (markdown) => {
    const ta = box('__loop_agent_stage');
    ta.value = String(markdown);
    ta.focus();
    ta.select();
    return document.activeElement === ta ? `staged ${ta.value.length} chars; press ctrl+c next` : 'stage failed: could not focus';
  };
  H.unstage = () => {
    document.getElementById('__loop_agent_stage')?.remove();
    return 'unstaged';
  };
  // READ fallback: select page → ctrl+shift+c (Copy as Markdown) → beginCapture() → press ctrl+v → info()/chunk(i).
  H.beginCapture = () => {
    H.captured = null;
    const ta = box('__loop_agent_capture');
    ta.addEventListener(
      'paste',
      (e) => {
        e.preventDefault();
        H.captured = e.clipboardData.getData('text/plain');
        ta.remove();
      },
      { once: true },
    );
    ta.focus();
    return document.activeElement === ta ? 'capture ready; press ctrl+v next' : 'capture failed: could not focus';
  };
  H.cleanup = () => {
    ['__loop_agent_stage', '__loop_agent_capture'].forEach((id) => document.getElementById(id)?.remove());
    H.captured = null;
    return 'cleaned up';
  };

  return `loop helpers v2 ready; ${H.locate()}`;
})();
