'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEditorStore } from '@/store/editorStore'
import { MermaidRenderer } from '@/components/editor/MermaidRenderer'

export function Preview() {
  const { openNote } = useEditorStore()

  return (
    <div className="markdown-preview" style={{ color: 'var(--text-primary)' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            
            // Intercept mermaid blocks
            if (!inline && match && match[1] === 'mermaid') {
              return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />
            }
            
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {openNote?.content ?? ''}
      </ReactMarkdown>
    </div>
  )
}
