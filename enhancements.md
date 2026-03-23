# DevNotes — Future Enhancements

This document tracks potential developer-focused features to make DevNotes an ultimate productivity tool.

## 1. File & Context Navigation
- **Command Palette (`⌘P`):** A VS Code-style quick-switcher to jump directly to any file by name across the entire tree, bypassing the need to hunt through the sidebar UI.
- **Multiple Tabs:** Allow having 3-5 notes open simultaneously in horizontal tabs at the top of the editor pane for easy cross-referencing.

## 2. Editor Power Features
- **Vim Mode Toggle:** Enable Vim keybindings in CodeMirror 6 for power users to edit code blocks and text at lightning speed without the mouse.
- **Drag & Drop Images:** Support drag-and-drop or clipboard paste for screenshots. Automatically upload the image to an `/assets` or `/.images` folder in the GitHub repo and insert the `![alt](url)` markdown snippet at the cursor.
- **Auto-TOC (Table of Contents):** A sticky right-hand outline generated from `## Headers` to jump between sections in long design docs or readmes.

## 3. Advanced Markdown Support
- **Mermaid.js Diagrams:** Extend the markdown preview `react-markdown` setup to recognize ````mermaid` blocks and render live architecture, flow, or sequence diagrams.
- **YAML Frontmatter Parsing:** Support metadata blocks at the top of notes (`--- tags: [frontend, auth] ---`). Use this to build a "tags" or "category" view in the sidebar.
- **Live Task Sync:** If a user clicks a markdown checkbox `[ ]` in the rendered *Preview* pane, automatically update the raw text to `[x]` and trigger a save/commit.

## 4. Application Architecture
- **Offline PWA Mode:** Make the app a progressive web app so it can be installed on macOS/Windows/iOS. Use IndexedDB to cache notes for offline writing, queuing up API requests string to be committed to GitHub automatically when internet is restored.
- **Note Templates:** A quick-action command to create pre-filled notes (e.g., "Daily Standup", "Meeting Notes", "Architecture Decision Record").
