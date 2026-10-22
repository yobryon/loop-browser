// Loop helpers for browser-driving agents.
// Inject once per page load with the Claude in Chrome javascript tool (paste this whole file as the code).
// It only creates temporary, invisible textareas used to move Markdown through the user's own clipboard with
// real (trusted) keystrokes. It reads no cookies, storage or tokens and makes no network requests.
(() => {
  const H = (window.__loopAgent = window.__loopAgent || {});

  const box = (id) => {
    document.getElementById(id)?.remove();
    const ta = document.createElement('textarea');
    ta.id = id;
    ta.setAttribute('aria-hidden', 'true');
    Object.assign(ta.style, { position: 'fixed', top: '0', left: '0', width: '2px', height: '2px', opacity: '0.01', zIndex: '2147483647' });
    document.body.appendChild(ta);
    return ta;
  };

  // WRITE step 1: put Markdown in a selected hidden textarea. Next: press ctrl+c (real keystroke),
  // then call unstage(), click into the Loop page where the content should go, and press ctrl+v.
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

  // READ step 2: after copying with Loop's "Copy as Markdown" (ctrl+shift+c), call beginCapture(), then press
  // ctrl+v (real keystroke). The paste is intercepted, so nothing is inserted into the page.
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
  H.info = (size = 800) =>
    H.captured == null ? 'nothing captured' : `${H.captured.length} chars in ${Math.ceil(H.captured.length / size)} chunk(s) of ${size}`;
  H.chunk = (i, size = 800) => (H.captured == null ? '' : H.captured.slice(i * size, (i + 1) * size));
  H.cleanup = () => {
    ['__loop_agent_stage', '__loop_agent_capture'].forEach((id) => document.getElementById(id)?.remove());
    H.captured = null;
    return 'cleaned up';
  };

  return 'loop helpers ready';
})();
