'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import { useEditorStore } from '@/store/editorStore'
import { Toolbar } from './Toolbar'

export function RichTextEditor() {
  const { openNote, setContent, saveNote } = useEditorStore()
  
  // Auto-save debouncer
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveNote()
    }, 3000)
  }, [saveNote])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    content: openNote?.content || '',
    onUpdate: ({ editor }) => {
      // Serialize rich text into raw markdown
      const markdownOutput = (editor.storage as any).markdown.getMarkdown()
      setContent(markdownOutput)
      debouncedSave()
    },
    editorProps: {
      attributes: {
        class: 'prose-container focus:outline-none p-6 md:p-10 min-h-full',
      },
    },
  })

  // Watch for external file changes (e.g. clicking a different file in the sidebar)
  useEffect(() => {
    if (editor && openNote && openNote.content !== (editor.storage as any).markdown.getMarkdown()) {
      editor.commands.setContent(openNote.content)
    }
  }, [openNote?.path]) // Only update when path changes

  // Keyboard shortcut to manually save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        saveNote()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveNote])

  if (!openNote) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <Toolbar editor={editor} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <style>{`
          .prose-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .ProseMirror p { margin-top: 0; margin-bottom: 1em; line-height: 1.6; color: var(--text-primary); font-size: 15px; }
          .ProseMirror h1 { font-size: 2em; margin-top: 0; margin-bottom: 0.5em; font-weight: 700; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
          .ProseMirror h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
          .ProseMirror h3 { font-size: 1.25em; margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; color: var(--text-primary); }
          .ProseMirror blockquote { border-left: 4px solid var(--accent); padding-left: 1em; margin-left: 0; color: var(--text-secondary); }
          .ProseMirror code { background: var(--bg-tertiary); padding: 0.2em 0.4em; border-radius: 6px; font-family: monospace; font-size: 0.9em; }
          .ProseMirror pre { background: var(--bg-secondary); padding: 1em; border-radius: 8px; overflow-x: auto; color: var(--text-primary); font-family: monospace; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; margin-bottom: 1em; }
          .ProseMirror li p { margin: 0; }
          .ProseMirror a { color: var(--accent); text-decoration: none; }
          .ProseMirror a:hover { text-decoration: underline; }
          .ProseMirror hr { border: none; border-top: 1px solid var(--border); margin: 2em 0; }
          .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        `}</style>
        <EditorContent editor={editor} style={{ height: '100%' }} />
      </div>
    </div>
  )
}
