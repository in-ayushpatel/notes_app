import { Editor } from '@tiptap/react'

export function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const btnStyle = (active: boolean) => ({
    background: active ? 'var(--bg-hover)' : 'transparent',
    color: active ? 'var(--text-primary)' : '#8b949e',
    border: 'none', borderRadius: '4px',
    padding: '6px 12px', fontSize: '14px', fontWeight: active ? '600' : '400',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.1s',
  })

  return (
    <div style={{
      display: 'flex', gap: '6px', padding: '8px 16px',
      borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)',
      flexWrap: 'wrap', alignItems: 'center', flexShrink: 0
    }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={btnStyle(editor.isActive('bold'))}
        title="Bold"
      ><b>B</b></button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={btnStyle(editor.isActive('italic'))}
        title="Italic"
      ><i>I</i></button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={btnStyle(editor.isActive('strike'))}
        title="Strikethrough"
      ><s>S</s></button>
      
      <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 6px' }} />
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={btnStyle(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >H1</button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={btnStyle(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >H2</button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        style={btnStyle(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >H3</button>
      
      <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 6px' }} />
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={btnStyle(editor.isActive('bulletList'))}
        title="Bullet List"
      >• List</button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={btnStyle(editor.isActive('orderedList'))}
        title="Ordered List"
      >1. List</button>
      
      <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 6px' }} />
      
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        style={btnStyle(editor.isActive('codeBlock'))}
        title="Code Block"
      >{`</>`}</button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={btnStyle(editor.isActive('blockquote'))}
        title="Blockquote"
      >""</button>
    </div>
  )
}
