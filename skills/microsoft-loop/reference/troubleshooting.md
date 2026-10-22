# Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Browser tools say several browsers are connected | No browser selected | Ask the user which browser is signed in to Loop, then select it. Don't guess. |
| Sign-in page instead of Loop | The user isn't signed in, or SSO is still loading | Wait a few seconds and reload once. If a sign-in form is shown, ask the user to sign in themselves. |
| `__loopAgent is not defined` | The page reloaded, or you're in a new tab | Re-inject `scripts/loop-helpers.js` |
| `editor API not found` | The page is still loading, or Loop changed its internals | Wait 2–3 s and call `__loopAgent.locate()` again. If it still fails, use the clipboard fallback and tell the user the helper may need updating. |
| `read()` returns the wrong page's content | You navigated without calling `locate()` | Call `__loopAgent.locate()` after opening each page |
| A checklist was written as plain bullets | The HTML used `<input type="checkbox">` | Use `<li class="scriptor-listItem-marker-value-unchecked">` / `…-checked` (see html.md) |
| An HTML write shows literal tags | The HTML was escaped twice, or passed as Markdown | Pass raw HTML in one JS string literal. Escape only the text content. |
| A paste inserted nothing | Focus wasn't in the editor (still on the staging box), or the paste was synthetic | Click the insertion point, then press `ctrl+v` with the `computer` tool. Never dispatch paste events from JavaScript. |
| A paste landed in the wrong place | The click moved the caret, or the caret was inside a component | `ctrl+z` straight away. Re-place the cursor (see techniques.md) and paste again. |
| Captured Markdown is identical to what you staged earlier | The copy didn't happen; the clipboard still holds the old content | Click a plain paragraph in the page, repeat `ctrl+a ctrl+a`, then `ctrl+shift+c` |
| Captured Markdown is only a fragment | The selection was confined to an embedded block (quote, table, code) | Click a plain paragraph, not a block, and repeat |
| A chunk of output is blocked or redacted | The browser tool's safety filter (it looks like cookie or query-string data) | Don't circumvent it. Use smaller chunks to isolate the problem, use `get_page_text` for that part, and tell the user. |
| The first typed characters appear at the end or out of order | Typed too soon after a cursor move | Wait about 1 s after `ctrl+End` or clicks before typing. Prefer paste for anything long. |
| New page title reads "My titleUntitled" | You typed without selecting the placeholder title | Click the title, `ctrl+a`, type again |
| A JavaScript call times out (renderer unresponsive) | Usually a pending permission prompt or a dialog | Take a screenshot. Ask the user to dismiss any prompt. Avoid `navigator.clipboard` APIs. |
| The tab was closed or the tab group is gone | The user closed it, or the extension reconnected | `tabs_context_mcp` with `createIfEmpty`, then navigate again |
| A Loop component opens from SharePoint/OneDrive and redirects | Direct file URLs often bounce to OneDrive | Open it from Loop's Recent list or its `loop.cloud.microsoft/p/…` link instead |
