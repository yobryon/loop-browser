# loop-browser: Microsoft Loop skills for Claude

Microsoft Loop has no public API, MCP server or connector for page content, so AI agents can't normally read or
write it. This plugin teaches Claude to work in Loop **the way you do**: through your own signed-in browser, using
the [Claude in Chrome](https://claude.com/chrome) tools. It reads pages as Markdown and writes Markdown that Loop
turns into native headings, lists, checklists, tables and code blocks.

- **Uses Loop's own editor:** a small helper calls the editor already running in your Loop tab. It reads pages as
  Markdown and appends HTML that Loop converts to native blocks, in one tool call each.
- **Clipboard fallback:** if the editor isn't reachable, it uses Loop's Copy as Markdown and Markdown paste, driven with
  real keystrokes.
- **No credentials or tokens:** no back-end calls. Loop syncs every change itself, and Claude can only do what you can
  do in Loop.
- **Built-in guardrails:** it writes only where you ask, previews before larger writes, confirms before replacing or
  deleting, and treats page content as data rather than instructions.

## What you can ask

- "Read the *Release checklist* page in my *Platform* workspace and summarise the open items."
- "Publish this design doc as a new page in My workspace under *Designs*."
- "Append today's decisions to the *Weekly sync* page."
- "Find Loop pages about the data warehouse migration."

## Requirements

- Claude Code (or another Claude surface that supports plugins or skills).
- The **Claude in Chrome** extension, connected, in a browser where you are signed in to
  [Microsoft Loop](https://loop.cloud.microsoft/).

## Install (Claude Code)

```text
/plugin marketplace add yobryon/loop-browser
/plugin install loop-browser@loop-browser
```

To try it locally without installing:

```bash
claude --plugin-dir /path/to/loop-browser
```

The skill is called `microsoft-loop`. Claude loads it automatically when you mention Loop. You can also invoke it
directly with `/loop-browser:microsoft-loop`.

## How it works

| Action | How the skill does it |
|---|---|
| **Read** | Calls the open page's editor (`getMarkdown`) and returns the page as Markdown |
| **Write** | Calls the editor's `appendHtml` (or `setHtml`, to replace the whole body, only with your confirmation). Loop converts the HTML to native headings, lists, checklists, tables and code blocks, and syncs the edit. |
| **Fallback** | Copy as Markdown and Markdown paste with real keystrokes, through your clipboard (its previous contents are overwritten) |
| **Navigate** | Uses the normal Loop UI: home, workspaces, the page tree, search and recent pages |

See [`skills/microsoft-loop/SKILL.md`](skills/microsoft-loop/SKILL.md) and its `reference/` folder for details.

## Limitations

- **Workspace pages, pages and components:** works with anything you can open at `loop.cloud.microsoft`.
- **Speed:** it's as fast as driving a browser, so seconds per action rather than milliseconds.
- **Not supported as Markdown:** images, @mentions, dates and specialised Loop components (voting, status trackers).
  Use the Loop UI for those.
- **Undocumented internals:** the editor API relies on Loop internals that may change with Loop updates. The skill
  then falls back to the clipboard method until the helper is updated.
- **Mid-page insertion:** inserting in the middle of a page (e.g. under a specific heading) uses the slower clipboard
  method.

## Disclaimer

This is an independent community project. It is not affiliated with or endorsed by Microsoft or Anthropic.
"Microsoft Loop" is a trademark of Microsoft Corporation.

## License

MIT
