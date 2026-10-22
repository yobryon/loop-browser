# loop-browser: Microsoft Loop skills for Claude

Microsoft Loop has no public API, MCP server or connector for page content, so AI agents can't normally read or
write it. This plugin teaches Claude to work in Loop **the way you do**: through your own signed-in browser, using
the [Claude in Chrome](https://claude.com/chrome) tools. It reads pages as Markdown and writes Markdown that Loop
turns into native headings, lists, checklists, tables and code blocks.

- **Uses Loop's own features:** Copy as Markdown and Markdown paste, driven with real keystrokes.
- **No credentials or tokens:** no API calls, no back-end access. Claude can only do what you can do in Loop.
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
| **Read** | Selects the page body, uses Loop's **Copy as Markdown** (`Ctrl+Shift+C`), and captures the clipboard through a temporary invisible text box. Nothing is inserted into the page. |
| **Write** | Puts the Markdown into a temporary invisible text box, copies it with a real `Ctrl+C`, and pastes it into the page with a real `Ctrl+V`. Loop converts the pasted Markdown. |
| **Navigate** | Uses the normal Loop UI: home, workspaces, the page tree, search and recent pages |

Your clipboard is used as the transfer channel, so its previous contents are overwritten.

See [`skills/microsoft-loop/SKILL.md`](skills/microsoft-loop/SKILL.md) and its `reference/` folder for details.

## Limitations

- **Workspace pages, pages and components:** works with anything you can open at `loop.cloud.microsoft`.
- **Speed:** it's as fast as driving a browser, so seconds per action rather than milliseconds.
- **Not supported as Markdown:** images, @mentions, dates and specialised Loop components (voting, status trackers).
  Use the Loop UI for those.
- **UI changes:** if Loop changes its UI or shortcuts, the techniques may need updating.

## Disclaimer

This is an independent community project. It is not affiliated with or endorsed by Microsoft or Anthropic.
"Microsoft Loop" is a trademark of Microsoft Corporation.

## License

MIT
