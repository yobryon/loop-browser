# Techniques in detail

Tool names below are the Claude in Chrome tools (`mcp__claude-in-chrome__…`). Batch predictable sequences with
`browser_batch`. Always take a screenshot before clicking somewhere you haven't seen.

## Why it works this way

- **Synthetic events are ignored.** Loop's editor only trusts real input. A paste event built in JavaScript
  (`new ClipboardEvent('paste', …)`) is swallowed and nothing is inserted.
- **The clipboard API is unreliable here.** `navigator.clipboard.writeText` can hang waiting for focus or a permission
  prompt.
- **What works is real keystrokes through the system clipboard:**
  - **Write:** the helper puts Markdown into a selected hidden textarea, a real `ctrl+c` copies it, and a real `ctrl+v`
    into the editor pastes it. Loop treats pasted plain text as Markdown.
  - **Read:** Loop's own **Copy as Markdown** (`ctrl+shift+c`) puts the selection on the clipboard as Markdown. A real
    `ctrl+v` into the helper's capture box hands it to the page script without inserting anything.

## Setup per tab

```text
tabs_context_mcp (createIfEmpty) → tabs_create_mcp → navigate https://loop.cloud.microsoft/
javascript_tool: <contents of scripts/loop-helpers.js>     → "loop helpers ready"
```
Check with `typeof window.__loopAgent` (`"object"`) before using the helpers. Re-inject after a reload.

## Reading

```text
computer scroll      up to the top of the page
computer left_click  <the first plain paragraph under the title>   (by coordinates from a fresh screenshot, or a fresh find ref)
computer key         "ctrl+a ctrl+a"
computer screenshot  → confirm the whole page body is highlighted
computer key         "ctrl+shift+c"
javascript_tool      __loopAgent.beginCapture()          → "capture ready; press ctrl+v next"
computer key         "ctrl+v"
javascript_tool      __loopAgent.info()                  → "2345 chars in 3 chunk(s) of 800"
javascript_tool      __loopAgent.chunk(0) … chunk(2)
javascript_tool      __loopAgent.cleanup()
```

- **Sanity check the length:** if `info()` reports far fewer characters than the page clearly holds (compare with
  `get_page_text`), the selection was partial. Common causes are a stale `find` ref that put the caret in a later
  section, or a click inside a component. Re-click the first paragraph and repeat.
- **Partial reads:** select a range instead of the whole page (click at the start, then `shift`+click at the end), then
  `ctrl+shift+c`. Only the selection is copied.
- **Selection stuck in a block:** if `info()` shows only a fragment (e.g. just a quote's text), the cursor was inside
  an embedded block. Click a normal paragraph and repeat.
- **Stale clipboard:** if the captured text is identical to something you staged earlier, the copy didn't happen.
  Repeat, and check the page has focus (click it first).
- **What the Markdown contains:**
  - headings `#`–`######`; `**bold**`, `*italic*`, `` `code` ``; `[text](url)` links;
  - nested `-` bullets (4-space indent) and `1.` numbered items; `- [ ]` / `- [x]` tasks;
  - `>` quotes; GFM tables; fenced code blocks with the language name (e.g. ` ```Javascript `).
- **What it leaves out:** the page title isn't included. Read it from the tab title or the large heading at the top.
- **Redaction:** the browser tool may block or redact output that looks like cookie or query-string data. That's a
  safety feature. Don't encode, transform or otherwise disguise content to get past it. Narrow down with smaller
  chunks, use `get_page_text` for the missing part (plain text only), and tell the user.

## Writing

```text
# 1. place the cursor (see below), then:
javascript_tool   __loopAgent.stage("## Heading\n\nParagraph with **bold**.\n\n- item\n- item\n")
computer key      "ctrl+c"
javascript_tool   __loopAgent.unstage()
computer left_click <the insertion point again>   (to append: any plain paragraph, then key "ctrl+End", wait 1)
computer key      "ctrl+v"
computer wait     2
# 2. verify: screenshot, or read back with the reading recipe
```

- **Escaping:** pass the Markdown as a JSON string literal (escape `"`, `\` and newlines), e.g. built with
  `JSON.stringify` in your own reasoning.
- **Large documents:** paste in sections of a few thousand characters, verifying between pastes. That limits the
  damage if focus moves.
- **Focus moves during staging,** so you must click the insertion point again before `ctrl+v`. Clicking also moves the
  caret, so click at the end of the target line (then press `End`) or on an empty paragraph.
- **Undo:** if a paste lands in the wrong place, press `ctrl+z` straight away (Loop supports undo), then retry.

## Placing the cursor

| Goal | Steps |
|---|---|
| **Append to the end of the page** | Click any plain paragraph, press `ctrl+End`, then `computer wait 1`. If the last line has text, press `End` then `Return` to start a new empty paragraph. |
| **Insert after a heading or paragraph** | Click at the right end of that line's text, press `End`, then `Return`. |
| **Replace a section** (confirm with the user first) | Click just before the first character of the section, `shift`+click just after the last character, then paste. The selection is replaced. Read the section first so you can show the user exactly what will be replaced. |
| **Empty new page** | Click the body placeholder ("Just start typing…") and paste directly. |

A cursor placed after a table, code block or other component may land inside it. Check with a screenshot. If the
cursor is in the wrong block, press `Escape` and click a plain paragraph.

**Typing directly** (`computer type`) works for short text, but:
- Wait about 1 s after any cursor move before typing. Typing immediately can drop or reorder the first characters.
- Markdown shortcuts fire as you type (`# `, `- `, `1. `, `[] `). Lists continue on `Return`: press `Return` twice to
  leave a list.

For more than a line or two, prefer paste.

## Pages and titles

**Create a page:** **Create new page** (bottom of the workspace page tree) or a page's `…` → **New subpage**.

**Set the title:** click the title, `ctrl+a`, then type. If you just type, the text goes in front of "Untitled".

**Rename:** select the title text the same way and type the new title. Loop renames the underlying file itself.

**Page options menu** (`…` on a tree item, or at the top right of a page):
- New subpage, Open, Share page link, Share Loop component;
- Rename and style, Rearrange (move), Duplicate;
- Add to workspace / Copy to workspace, Save page as template;
- Delete (sends the page to the workspace Recycle bin, after an in-app confirmation).

**Before any delete:** get the user's explicit confirmation, name the page, and tell them it can be restored from the
workspace's Recycle bin.

## Navigating

| Location | What's there |
|---|---|
| **Home** (`https://loop.cloud.microsoft/`) | Tabs **Workspaces** and **Recent components and pages**. Workspace cards are links. |
| **Left rail** | Search, Notifications, Recent, Meeting notes (Loop components created in meetings), Workspaces, My workspace, recently used workspaces |
| **Page tree** (inside a workspace) | Items are tree items. Collapsed parents show a `>` chevron. Use `find` with the page name to get a reference to click. |

**Page URLs** (`https://loop.cloud.microsoft/p/…`) are long, opaque links. Save the URL from the tab context if you'll
come back to a page.

**Search** is in the left rail and searches pages and components across workspaces. Results open in the same tab.
