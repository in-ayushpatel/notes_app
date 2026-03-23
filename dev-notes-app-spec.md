# 🧠 Developer Notes App — AI Implementation Specification

# 🧠 Developer Notes App — AI Implementation Specification

---

# 1. 🎯 Product Definition

## 1.1 Objective

Build a **cross-device, GitHub-synced, markdown-based notes web application** for developers with:

* Full ownership of notes (stored in user's GitHub repo)
* Folder-based organization (like Obsidian)
* Fast editing experience (like VSCode)
* Zero vendor lock-in
* Minimal but powerful UI

---

## 1.2 Non-Negotiable Constraints

* MUST use `.md` files as source of truth
* MUST use GitHub repo for storage/sync
* MUST support multi-device usage
* MUST NOT store notes in proprietary DB
* MUST keep system stateless (backend optional persistence only for auth/session)

---

# 2. 🧱 System Architecture

## 2.1 High-Level Architecture

```
Frontend (Next.js)
    |
    | HTTPS (API calls)
    ↓
Backend (Next.js API routes / Node.js)
    |
    | GitHub REST API
    ↓
User GitHub Repository
```

---

## 2.2 Architecture Decisions

### Why GitHub?

* Version control (history, rollback)
* Free sync across devices
* No infra cost
* Developer-native

### Why Markdown?

* Portable
* Lightweight
* Widely supported

---

# 3. 📁 Repository Structure (STRICT)

The app MUST assume this structure:

```
<user-repo>/
│
├── .notes-config.json
├── README.md
│
├── notes/
│   ├── DSA/
│   │   ├── arrays.md
│   │   ├── graphs.md
│   │
│   ├── SystemDesign/
│   │   ├── scalability.md
│   │
│   └── Personal/
│       ├── ideas.md
```

---

## 3.1 Rules

* ALL notes MUST exist inside `/notes`
* Only `.md` files are valid notes
* Folder structure = navigation tree
* `.notes-config.json` stores metadata

---

# 4. 🔐 Authentication (GitHub OAuth)

## 4.1 Required Permissions

* `repo` (private + public)

---

## 4.2 OAuth Flow

1. User clicks "Login with GitHub"
2. Redirect to GitHub OAuth
3. Backend receives `code`
4. Exchange `code → access_token`
5. Store token in:

   * HTTP-only cookie (preferred)
6. Frontend never directly accesses token

---

## 4.3 API Contract

### GET `/api/auth/login`

Redirects to GitHub OAuth

### GET `/api/auth/callback`

Handles OAuth response

### GET `/api/auth/me`

Returns authenticated user info

---

# 5. 📦 Backend Specification

## 5.1 Responsibilities

* GitHub API proxy
* Authentication handling
* File operations
* Conflict handling

---

## 5.2 GitHub API Integration

### Required Operations

| Operation   | API                                  |
| ----------- | ------------------------------------ |
| Get tree    | `/repos/:owner/:repo/git/trees`      |
| Get file    | `/repos/:owner/:repo/contents/:path` |
| Update file | same endpoint                        |
| Delete file | same endpoint                        |

---

## 5.3 File Update Flow (CRITICAL)

1. Fetch file metadata (get SHA)
2. Encode content → Base64
3. PUT request with:

```
{
  message: "update note",
  content: "<base64>",
  sha: "<existing_sha>"
}
```

---

## 5.4 API Endpoints (IMPLEMENT EXACTLY)

### 5.4.1 GET `/api/tree`

Returns:

```
{
  tree: FileNode[]
}
```

---

### 5.4.2 GET `/api/file?path=...`

Returns:

```
{
  content: string,
  sha: string
}
```

---

### 5.4.3 PUT `/api/file`

Body:

```
{
  path: string,
  content: string,
  message: string
}
```

---

### 5.4.4 DELETE `/api/file`

Body:

```
{
  path: string,
  message: string
}
```

---

### 5.4.5 POST `/api/create`

Body:

```
{
  path: string,
  type: "file" | "folder"
}
```

---

# 6. 🧠 Data Models

## 6.1 FileNode

```
type FileNode = {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileNode[]
}
```

---

## 6.2 Note

```
type Note = {
  path: string
  content: string
  sha: string
  lastModified?: string
}
```

---

# 7. 🎨 Frontend Specification

## 7.1 Tech Stack

* Next.js (App Router)
* Tailwind CSS
* Zustand (state management)
* CodeMirror (editor)

---

## 7.2 Layout (MANDATORY)

```
-----------------------------------------
| Sidebar        | Editor               |
| (File Tree)    | Markdown Editor      |
-----------------------------------------
```

---

## 7.3 Core Components

### 7.3.1 Sidebar

* Tree rendering
* Expand/collapse folders
* Right-click menu:

  * New file
  * New folder
  * Delete

---

### 7.3.2 Editor

* Markdown editing
* Syntax highlighting
* Auto-save
* Preview toggle

---

### 7.3.3 Top Bar

* Current file path
* Save status (Saving / Saved)
* Sync status

---

# 8. ✍️ Editor Requirements

## MUST support:

* Headings (#, ##)
* Code blocks (```)
* Inline code
* Lists
* Tables
* Links

---

## ç

* Debounce: 3 seconds
* Save triggers:

  * On content change
  * On file switch
  * On blur

---

# 9. 🔄 Sync Strategy

## 9.1 Initial Load

* Fetch full tree
* Lazy load file content

---

## 9.2 Save Flow

1. User edits
2. Debounce triggers save
3. API call
4. GitHub commit

---

## 9.3 Conflict Handling (MVP)

* Last write wins
* Show warning if SHA mismatch

---

# 10. 🔍 Search

## Requirements

* Full-text search
* Works on loaded notes
* Use Fuse.js

---

# 11. ⚡ Performance Requirements

* Tree load < 500ms
* Editor input lag < 16ms
* Avoid full repo reload
* Cache opened notes

---

# 12. 💾 Local Caching (IMPORTANT)

Use:

* IndexedDB or localStorage

Store:

* Recently opened notes
* Last content

---

# 13. 🧪 Testing Strategy

## Unit Tests

* Tree parsing
* Editor behavior

## Integration Tests

* GitHub sync
* Auth

---

# 14. 🚀 Deployment

## Frontend

* Vercel

## Backend

* Vercel API routes

---

# 15. 🧭 Implementation Plan (STRICT ORDER)

## Phase 1 (Core)

* [ ] GitHub OAuth
* [ ] Fetch repo tree
* [ ] Render sidebar
* [ ] Open file
* [ ] Edit + save file

---

## Phase 2

* [ ] Search
* [ ] Create/delete files
* [ ] Rename

---

## Phase 3

* [ ] Offline caching
* [ ] Conflict UI

---

# 16. ❗ Edge Cases (IMPORTANT)

* Empty repo
* Large files
* Deep folder nesting
* GitHub rate limits
* Network failure

---

# 17. 🤖 AI Coding Rules (MANDATORY)

* Use TypeScript everywhere
* No class components
* Use functional components + hooks
* Avoid global state unless needed
* Write modular code
* Separate:

  * UI
  * Logic
  * API calls

---

# 18. 📌 Future Enhancements

* Tags (#tag parsing)
* Backlinks
* Graph view
* Multi-repo support
* Mobile PWA

---

# 19. 🧠 Success Criteria

* User can:

  * Login with GitHub
  * See notes tree
  * Edit note
  * Save → reflected in GitHub repo
  * Open from another device → changes visible

---

# 20. 🔥 Final Instruction for AI

Build a **working MVP first** with:

* Auth
* Tree
* Editor
* Save

DO NOT over-engineer.

Focus on:

* Speed
* Simplicity
* Reliability

---

