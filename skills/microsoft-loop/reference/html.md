# HTML for the editor API (`__loopAgent.append` / `replaceAll`)

The editor API takes **HTML**, which Loop converts into native blocks. Reads come back as **Markdown**. Write simple,
semantic HTML: no styles, scripts, `<div>` wrappers or attributes other than those listed here.

Every row below was verified: written with `append`, then read back with `getMarkdown`.

| Want | HTML |
|---|---|
| Heading 1–3 | `<h1>…</h1>`, `<h2>…</h2>`, `<h3>…</h3>` |
| Paragraph | `<p>…</p>` |
| Bold / italic / inline code | `<b>…</b>`, `<i>…</i>`, `<code>…</code>` |
| Link | `<a href="https://…">text</a>` |
| Bulleted list (nested) | `<ul><li>one</li><li>two<ul><li>nested</li></ul></li></ul>` |
| Numbered list | `<ol><li>first</li><li>second</li></ol>` |
| Checklist | `<ul><li class="scriptor-listItem-marker-value-unchecked">open</li><li class="scriptor-listItem-marker-value-checked">done</li></ul>` (Loop's own classes; `<input type="checkbox">` does **not** work) |
| Quote | `<blockquote>…</blockquote>` |
| Table | `<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>` (first row becomes the column headers) |
| Code block | `<pre><code class="language-python">print(1)</code></pre>` (language preset from the class) |

## Rules

- **Escape text content.** `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, and `"` → `&quot;` inside attribute values. Code
  inside `<pre><code>` needs escaping too.
- **Pass the HTML as one JavaScript string literal,** e.g. `await __loopAgent.append("<h2>Title</h2><p>Body</p>")`.
- **Write large documents in sections,** up to about 20 KB of HTML per call, reading back the size after each.
- **Not supported here:** images, @mentions, date chips and other Loop components. Use the UI for those, or write
  plain text instead.
- **`replaceAll` rewrites the whole body.** Embedded components the HTML doesn't recreate are lost. Use it only with
  the user's explicit confirmation, and read the page first so you can tell them what will change.

## Converting Markdown you already have

| Markdown | HTML |
|---|---|
| `#`/`##`/`###` | `h1`/`h2`/`h3` |
| Paragraphs | `p` |
| `**x**` / `*x*` / `` `x` `` | `b` / `i` / `code` |
| `[t](u)` | `a` |
| `-`/`*` | `ul`/`li` (nest a `ul` inside the parent `li`) |
| `1.` | `ol` |
| `- [ ]` / `- [x]` | Checklist `li` with the classes above |
| `>` | `blockquote` |
| GFM tables | `table` |
| Fenced code | `pre`/`code` with `class="language-<lang>"` |
