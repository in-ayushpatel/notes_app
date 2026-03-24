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
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Serialize rich text into raw markdown
      const markdownOutput = (editor.storage as any).markdown.getMarkdown()
      setContent(markdownOutput)
      debouncedSave()
    },
    editorProps: {
      attributes: {
        class: 'prose-container focus:outline-none min-h-full',
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-primary)' }}>
      <Toolbar editor={editor} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <style>{`
          .prose-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 40px 24px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box !important;
          }
          @media (max-width: 768px) {
            .prose-container { padding: 20px 16px !important; }
          }
          .ProseMirror { min-height: 200px; width: 100% !important; }
          .ProseMirror p { margin: 0 0 1.25em; line-height: 1.8; color: #adbac7; font-size: 16px; }
          .ProseMirror h1 { font-size: 2.5em; margin: 0 0 0.6em; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
          .ProseMirror h2 { font-size: 1.8em; margin: 1.6em 0 0.6em; font-weight: 700; color: var(--text-primary); border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.3em; }
          .ProseMirror h3 { font-size: 1.4em; margin: 1.4em 0 0.6em; font-weight: 600; color: var(--text-primary); }
          .ProseMirror blockquote { border-left: 4px solid var(--accent); padding: 0.5em 0 0.5em 1.5em; margin: 1.5em 0; color: #768390; font-style: italic; background: rgba(88,166,255,0.05); border-radius: 0 8px 8px 0; }
          .ProseMirror code { background: rgba(99,110,123,0.3); padding: 0.2em 0.4em; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; font-size: 0.85em; color: #e6edf3; }
          .ProseMirror pre { background: #1c2128; padding: 1.25em; border-radius: 12px; border: 1px solid var(--border); margin: 1.5em 0; overflow-x: auto; }
          .ProseMirror pre code { background: transparent; padding: 0; border-radius: 0; color: inherit; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; margin: 0 0 1.25em; }
          .ProseMirror li { margin-bottom: 0.5em; color: #adbac7; line-height: 1.7; }
          .ProseMirror li p { margin: 0; }
          .ProseMirror hr { border: none; border-top: 2px solid var(--border-subtle); margin: 2.5em 0; }
          .ProseMirror a { color: var(--accent); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.1s; }
          .ProseMirror a:hover { border-bottom-color: var(--accent); }
        `}</style>
        <EditorContent editor={editor} style={{ height: '100%' }} />
      </div>
    </div>
  )
}
