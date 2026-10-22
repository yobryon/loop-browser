# How Loop works (background)

You don't need this to use the skill. It explains why the skill works through the browser, and what to expect.

## Storage

- **Pages and components are files.** Every Loop page or component is a `.loop` file.
- **Workspace pages** live in SharePoint Embedded containers, one per workspace. Microsoft's Loop app owns those
  containers, and other apps can't open them, even with the user's permission.
- **Loop components** live in ordinary OneDrive or SharePoint storage. These are the components created in Teams
  chats, Outlook or meeting notes.
- **The page tree** of a workspace is stored separately, in a workspace file (`.pod`).

## Format

- **Fluid documents.** Each file is a Fluid Framework document. Edits are small operations streamed live between all
  open clients, which is why changes appear for everyone in real time.
- **Text model.** A page's text is a shared rich-text structure: paragraph markers carry heading, list and checklist
  properties.
- **Embedded components.** Tables, code blocks, quotes and other components are embedded sub-documents.

## Why there is no simple API

- Microsoft Graph exposes Loop files as opaque files. Downloading one doesn't give you readable content.
- There is no supported API for reading or editing the content, or for managing workspace page trees.
- Third-party apps are blocked from workspace containers entirely.

The Loop web app itself is the reliable interface. It has a built-in Markdown export (Copy as Markdown) and treats
pasted plain text as Markdown. That's what this skill uses.

## Consequences for agents

- **Edits are live and attributed** to the signed-in user, like any other edit they make.
- **Writes sync immediately.** There is no "save" step. Use `ctrl+z` straight away to undo a mistaken paste.
- **Permissions are the user's own.** Anything the user can't open in Loop, the agent can't either.
