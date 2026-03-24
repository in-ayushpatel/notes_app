import { Editor } from '@tiptap/react'

export function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const btnStyle = (active: boolean) => ({
    background: active ? 'var(--accent-subtle)' : 'transparent',
    color: active ? 'var(--accent)' : '#8b949e',
    border: active ? '1px solid rgba(88,166,255,0.4)' : '1px solid transparent',
    borderRadius: '6px',
    width: '32px', height: '32px',
    fontSize: '14px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s ease',
    flexShrink: 0
  })

  const Icon = ({ path, size = 18 }: { path: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )

  return (
    <div style={{
      display: 'flex', gap: '4px', padding: '8px 12px',
      borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)',
      flexWrap: 'wrap', alignItems: 'center', flexShrink: 0
    }}>
      <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={btnStyle(editor.isActive('bold'))}
          title="Bold (⌘B)"
        >
          <Icon path="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={btnStyle(editor.isActive('italic'))}
          title="Italic (⌘I)"
        >
          <Icon path="M19 4h-9M14 20H5M15 4L9 20" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={btnStyle(editor.isActive('strike'))}
          title="Strikethrough"
        >
          <Icon path="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6 M4 12h16" />
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          style={btnStyle(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        ><span style={{ fontWeight: '800', fontSize: '12px' }}>H1</span></button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={btnStyle(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        ><span style={{ fontWeight: '800', fontSize: '12px' }}>H2</span></button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={btnStyle(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        ><span style={{ fontWeight: '800', fontSize: '12px' }}>H3</span></button>
      </div>
      
      <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={btnStyle(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <Icon path="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={btnStyle(editor.isActive('orderedList'))}
          title="Ordered List"
        >
          <Icon path="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M4 18h2.5 M6 14 A2 2 0 0 0 2 14" />
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          style={btnStyle(editor.isActive('codeBlock'))}
          title="Code Block"
        >
          <Icon path="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={btnStyle(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Icon path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </button>
      </div>
    </div>
  )
}
