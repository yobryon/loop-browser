# Markdown ⇄ Loop

## Pasting Markdown into Loop (verified)

| Markdown | Becomes in Loop |
|---|---|
| `#`, `##`, `###` … | Heading 1, 2, 3 … |
| `**bold**`, `*italic*` | Bold, italic |
| `` `code` `` | Inline code |
| `[text](https://…)` | Link |
| `- item` (nesting with 2-space indent) | Bulleted list, nested levels |
| `1. item` | Numbered list (nested items are lettered: a., b., …) |
| `- [ ] task` / `- [x] task` | Checklist item, unchecked or checked (checked items show struck through) |
| `> quote` | Quote block |
| GFM table (`\| a \| b \|` + `\| --- \| --- \|`) | Native Loop table; the first row becomes the column headers |
| fenced code block, e.g. ` ```js ` | Code block with the language preset (e.g. JavaScript) |
| Blank line between blocks | Paragraph break |

## Writing tips

- **Leave a blank line between blocks,** especially before and after lists, tables and code fences.
- **Indent nested list items with 2 spaces** when writing. Loop's own Markdown output uses 4.
- **Let Loop number the list.** It renumbers `1.` lists automatically, so `1.` on every item is fine.
- **Images can't be pasted as Markdown.** `![alt](url)` won't embed an image. Insert images through the Loop UI, or
  leave a link.
- **Mentions, dates and other Loop components** (`@person`, date chips, voting tables, status trackers) have no
  Markdown form. Write plain text (e.g. "Owner: Jane Doe, due 2026-11-01") unless the user asks you to insert the
  component through the UI with `/`.
- **Raw HTML is not interpreted.** Don't paste it.
- **Big tables** become Loop tables with editable cells. Keep them reasonably small (tens of rows), and paste them on
  their own between paragraphs.

## Reading Loop as Markdown (Copy as Markdown, `ctrl+shift+c`)

- **Lists:** bullets come back with `-` and 4-space nesting; numbered items come back as `1.`, `2.`.
- **Checklists:** `- [ ]` / `- [x]`.
- **Code blocks:** the fence carries Loop's language name, e.g. ` ```Javascript `.
- **Tables:** GFM tables. The row-number column isn't included.
- **Not included:** the page title. Embedded Loop components (status trackers, voting tables and so on) may come back
  simplified or as plain text.
