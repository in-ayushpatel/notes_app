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
          h1: ({ children, ...props }) => {
             const id = String(children).toLowerCase().replace(/[^\w]+/g, '-')
             return <h1 id={id} {...props} style={{ scrollMarginTop: '20px' }}>{children}</h1>
          },
          h2: ({ children, ...props }) => {
             const id = String(children).toLowerCase().replace(/[^\w]+/g, '-')
             return <h2 id={id} {...props} style={{ scrollMarginTop: '20px' }}>{children}</h2>
          },
          h3: ({ children, ...props }) => {
             const id = String(children).toLowerCase().replace(/[^\w]+/g, '-')
             return <h3 id={id} {...props} style={{ scrollMarginTop: '20px' }}>{children}</h3>
          },
          h4: ({ children, ...props }) => {
             const id = String(children).toLowerCase().replace(/[^\w]+/g, '-')
             return <h4 id={id} {...props} style={{ scrollMarginTop: '20px' }}>{children}</h4>
          },
          h5: ({ children, ...props }) => {
             const id = String(children).toLowerCase().replace(/[^\w]+/g, '-')
             return <h5 id={id} {...props} style={{ scrollMarginTop: '20px' }}>{children}</h5>
          },
          h6: ({ children, ...props }) => {
             const id = String(children).toLowerCase().replace(/[^\w]+/g, '-')
             return <h6 id={id} {...props} style={{ scrollMarginTop: '20px' }}>{children}</h6>
          },
          img: ({ src, alt, ...props }) => {
            let finalSrc = src
            if (typeof src === 'string' && src.startsWith('.')) {
              // rewrite relative src like .images/... to api, stripping only exactly './'
              finalSrc = `/api/image?path=${src.replace(/^\.\//, '')}`
            }
            return <img src={finalSrc as string} alt={alt} {...props} style={{ maxWidth: '100%', borderRadius: '6px', margin: '16px 0' }} />
          },
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
