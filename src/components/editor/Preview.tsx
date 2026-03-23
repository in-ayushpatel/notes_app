'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEditorStore } from '@/store/editorStore'

export function Preview() {
  const { openNote } = useEditorStore()

  return (
    <div className="markdown-preview" style={{ color: 'var(--text-primary)' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {openNote?.content ?? ''}
      </ReactMarkdown>
    </div>
  )
}
