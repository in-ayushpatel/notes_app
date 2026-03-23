'use client'

import { create } from 'zustand'
import { FileNode, GitHubRepo } from '@/types'

interface SelectedRepo {
  owner: string
  repo: string
  fullName: string
}

interface TreeState {
  tree: FileNode[]
  selectedRepo: SelectedRepo | null
  allRepos: GitHubRepo[]
  isLoadingTree: boolean
  isLoadingRepos: boolean
  fetchRepos: () => Promise<void>
  selectRepo: (repo: GitHubRepo) => Promise<void>
  fetchTree: () => Promise<void>
  refreshTree: () => Promise<void>
  restoreRepo: () => Promise<void>
}

export const useTreeStore = create<TreeState>((set, get) => ({
  tree: [],
  selectedRepo: null,
  allRepos: [],
  isLoadingTree: false,
  isLoadingRepos: false,

  fetchRepos: async () => {
    set({ isLoadingRepos: true })
    try {
      const res = await fetch('/api/repos')
      if (res.ok) {
        const { repos } = await res.json()
        set({ allRepos: repos })
      }
    } finally {
      set({ isLoadingRepos: false })
    }
  },

  selectRepo: async (repo: GitHubRepo) => {
    const [owner, repoName] = repo.full_name.split('/')
    await fetch('/api/repo/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner, repo: repoName }),
    })
    set({
      selectedRepo: { owner, repo: repoName, fullName: repo.full_name },
      tree: [],
    })
    await get().fetchTree()
  },

  /** Read the previously saved repo from the cookie (via API) and restore state */
  restoreRepo: async () => {
    try {
      const res = await fetch('/api/repo/select')
      if (!res.ok) return
      const { repo } = await res.json()
      if (!repo) return
      const fullName = `${repo.owner}/${repo.repo}`
      set({ selectedRepo: { owner: repo.owner, repo: repo.repo, fullName } })
      await get().fetchTree()
    } catch {
      // no saved repo
    }
  },

  fetchTree: async () => {
    set({ isLoadingTree: true })
    try {
      const res = await fetch('/api/tree')
      if (res.ok) {
        const { tree } = await res.json()
        set({ tree })
      }
    } catch {
      set({ tree: [] })
    } finally {
      set({ isLoadingTree: false })
    }
  },

  refreshTree: async () => {
    // Silent refresh — do NOT set isLoadingTree so FileTree stays mounted
    // and the expanded-folder state is preserved in the component
    try {
      const res = await fetch('/api/tree')
      if (res.ok) {
        const { tree } = await res.json()
        set({ tree })
      }
    } catch {
      /* ignore refresh errors silently */
    }
  },
}))
