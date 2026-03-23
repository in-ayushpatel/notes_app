'use client'

import { create } from 'zustand'
import { Note, SaveStatus } from '@/types'

interface EditorState {
  openNote: Note | null
  isDirty: boolean
  saveStatus: SaveStatus
  noteCache: Map<string, Note>
  openFile: (path: string) => Promise<void>
  setContent: (content: string) => void
  saveNote: () => Promise<void>
  closeNote: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openNote: null,
  isDirty: false,
  saveStatus: { status: 'idle' },
  noteCache: new Map(),

  openFile: async (path: string) => {
    // Save current note if dirty
    const { openNote, isDirty, saveNote } = get()
    if (openNote && isDirty) {
      await saveNote()
    }

    // Check cache
    const cached = get().noteCache.get(path)
    if (cached) {
      set({ openNote: cached, isDirty: false, saveStatus: { status: 'idle' } })
      return
    }

    set({ saveStatus: { status: 'idle' } })

    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`)
      if (!res.ok) throw new Error('Failed to fetch file')
      const { content, sha } = await res.json()

      const note: Note = { path, content, sha }
      const cache = get().noteCache
      cache.set(path, note)

      set({ openNote: note, isDirty: false, saveStatus: { status: 'idle' } })

      // Also save to localStorage
      try {
        const recentRaw = localStorage.getItem('recentNotes')
        const recent: string[] = recentRaw ? JSON.parse(recentRaw) : []
        const updated = [path, ...recent.filter((p) => p !== path)].slice(0, 10)
        localStorage.setItem('recentNotes', JSON.stringify(updated))
      } catch { /* ignore */ }
    } catch (err) {
      console.error('openFile error:', err)
    }
  },

  setContent: (content: string) => {
    const { openNote } = get()
    if (!openNote) return
    set({
      openNote: { ...openNote, content },
      isDirty: true,
    })
  },

  saveNote: async () => {
    const { openNote } = get()
    if (!openNote) return

    set({ saveStatus: { status: 'saving' } })

    try {
      const res = await fetch('/api/file', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: openNote.path,
          content: openNote.content,
          sha: openNote.sha,
          message: `update: ${openNote.path}`,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Save failed')
      }

      const { sha } = await res.json()
      const updatedNote = { ...openNote, sha }

      // Update cache
      const cache = get().noteCache
      cache.set(openNote.path, updatedNote)

      set({
        openNote: updatedNote,
        isDirty: false,
        saveStatus: { status: 'saved' },
      })

      // Reset status after 2s
      setTimeout(() => set({ saveStatus: { status: 'idle' } }), 2000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      set({ saveStatus: { status: 'error', message: msg } })
    }
  },

  closeNote: () => {
    set({ openNote: null, isDirty: false, saveStatus: { status: 'idle' } })
  },
}))
