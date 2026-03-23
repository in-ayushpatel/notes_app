'use client'

import { useState, useRef, useEffect } from 'react'
import { FileNode } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { useTreeStore } from '@/store/treeStore'
import { useSearchStore } from '@/store/searchStore'

export function FileTree({ nodes }: { nodes: FileNode[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [creating, setCreating] = useState<{ parentPath: string; type: 'file' | 'folder' } | null>(null)
  const [newName, setNewName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { openFile, openNote } = useEditorStore()
  const { refreshTree } = useTreeStore()
  const { indexNote } = useSearchStore()

  useEffect(() => {
    if (creating) setTimeout(() => inputRef.current?.focus(), 30)
  }, [creating])

  const toggle = (path: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })
  }

  const startCreate = (e: React.MouseEvent, parentPath: string, type: 'file' | 'folder') => {
    e.stopPropagation()
    setCreating({ parentPath, type })
    setNewName('')
    // Auto-expand parent
    setExpanded(prev => new Set([...prev, parentPath]))
  }

  const cancelCreate = () => { setCreating(null); setNewName('') }

  const submitCreate = async () => {
    if (!newName.trim() || !creating) { cancelCreate(); return }
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const name = newName.trim()
      const path = creating.type === 'file'
        ? `${creating.parentPath}/${name.endsWith('.md') ? name : name + '.md'}`
        : `${creating.parentPath}/${name}`
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, type: creating.type }),
      })
      const data = await res.json()
      await refreshTree()
      if (creating.type === 'file' && data.path) {
        setTimeout(() => openFile(data.path), 300)
      }
    } catch (err) {
      console.error('Create error:', err)
    } finally {
      setIsSubmitting(false)
      cancelCreate()
    }
  }

  const handleDelete = async (e: React.MouseEvent, node: FileNode) => {
    e.stopPropagation()
    if (!window.confirm(`Delete "${node.name}"?`)) return
    setDeleting(node.path)
    try {
      if (node.type === 'file') {
        const r = await fetch(`/api/file?path=${encodeURIComponent(node.path)}`)
        const { sha } = await r.json()
        await fetch('/api/file', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: node.path, sha, message: `delete: ${node.path}` }),
        })
      }
      await refreshTree()
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleting(null)
    }
  }

  const renderNode = (node: FileNode, depth = 0): React.ReactNode => {
    const isOpen = openNote?.path === node.path
    const isExpanded = expanded.has(node.path)
    const isHovered = hoveredPath === node.path
    const isDeletingThis = deleting === node.path
    const isFolder = node.type === 'folder'

    return (
      <div key={node.path}>
        {/* Row */}
        <div
          style={{
            paddingLeft: `${8 + depth * 16}px`,
            paddingRight: '6px',
            paddingTop: '4px',
            paddingBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            borderRadius: '6px',
            margin: '1px 4px',
            fontSize: '13px',
            color: isOpen ? 'var(--accent)' : 'var(--text-secondary)',
            background: isOpen ? 'var(--accent-subtle)' : isHovered ? 'var(--bg-hover)' : 'transparent',
            opacity: isDeletingThis ? 0.4 : 1,
            transition: 'background 0.1s',
            userSelect: 'none',
            position: 'relative',
          }}
          onClick={() => {
            if (isFolder) {
              setExpanded(prev => {
                const next = new Set(prev)
                next.has(node.path) ? next.delete(node.path) : next.add(node.path)
                return next
              })
            } else {
              openFile(node.path).then(() => {
                fetch(`/api/file?path=${encodeURIComponent(node.path)}`)
                  .then(r => r.json())
                  .then(({ content }) => indexNote(node.path, content))
                  .catch(() => {})
              })
            }
          }}
          onMouseEnter={() => setHoveredPath(node.path)}
          onMouseLeave={() => setHoveredPath(null)}
        >
          {/* Expand arrow (folders) or spacer (files) */}
          {isFolder ? (
            <span
              style={{
                fontSize: '9px', color: 'var(--text-muted)', flexShrink: 0, width: '10px',
                transition: 'transform 0.15s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                display: 'inline-block',
              }}
            >▶</span>
          ) : (
            <span style={{ width: '10px', flexShrink: 0 }} />
          )}

          {/* Icon */}
          <span style={{ fontSize: '13px', flexShrink: 0 }}>
            {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
          </span>

          {/* Name */}
          <span style={{
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontWeight: isOpen ? '500' : '400',
          }}>
            {isFolder ? node.name : node.name.replace(/\.md$/, '')}
          </span>

          {/* Action buttons — shown on hover */}
          {isHovered && (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* + Note (folders only) */}
              {isFolder && (
                <button
                  title="New note"
                  onClick={e => startCreate(e, node.path, 'file')}
                  style={btnStyle('#238636')}
                  onMouseEnter={e => hoverIn(e, '#2ea043')}
                  onMouseLeave={e => hoverOut(e, '#238636')}
                >
                  <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: 1 }}>+📄</span>
                </button>
              )}

              {/* + Folder (folders only) */}
              {isFolder && (
                <button
                  title="New folder"
                  onClick={e => startCreate(e, node.path, 'folder')}
                  style={btnStyle('#1f6feb')}
                  onMouseEnter={e => hoverIn(e, '#388bfd')}
                  onMouseLeave={e => hoverOut(e, '#1f6feb')}
                >
                  <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: 1 }}>+📁</span>
                </button>
              )}

              {/* Delete */}
              <button
                title="Delete"
                onClick={e => handleDelete(e, node)}
                style={btnStyle('#6e7681')}
                onMouseEnter={e => hoverIn(e, '#f85149', true)}
                onMouseLeave={e => hoverOut(e, '#6e7681')}
              >
                <span style={{ fontSize: '11px', lineHeight: 1 }}>🗑</span>
              </button>
            </div>
          )}
        </div>

        {/* Inline create input — appears below parent folder */}
        {creating && creating.parentPath === node.path && (
          <div style={{
            paddingLeft: `${8 + (depth + 1) * 16 + 24}px`,
            paddingRight: '10px',
            marginBottom: '2px',
          }}>
            <input
              ref={inputRef}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') submitCreate()
                if (e.key === 'Escape') cancelCreate()
              }}
              onBlur={submitCreate}
              disabled={isSubmitting}
              placeholder={creating.type === 'file' ? 'note-name.md' : 'folder-name'}
              style={{
                width: '100%', background: 'var(--bg-tertiary)',
                border: '1px solid var(--accent)', borderRadius: '5px',
                color: 'var(--text-primary)', padding: '4px 8px',
                fontSize: '12px', outline: 'none',
              }}
            />
          </div>
        )}

        {/* Children */}
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.filter(c => !(c.type === 'file' && c.name === '.gitkeep')).map(child => renderNode(child, depth + 1))}
            {node.children.filter(c => !(c.type === 'file' && c.name === '.gitkeep')).length === 0 && (
              <div style={{
                fontSize: '11px', color: 'var(--text-muted)',
                fontStyle: 'italic',
                padding: `4px 12px 4px ${8 + (depth + 1) * 16 + 24}px`,
              }}>
                empty
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '4px 0' }}>
      {nodes.length === 0 ? (
        <div style={{
          padding: '24px 16px', textAlign: 'center',
          color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.7',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📭</div>
          No notes yet.<br />
          Use the <strong style={{ color: 'var(--text-secondary)' }}>+</strong> button above<br />
          to create your first note.
        </div>
      ) : (
        nodes.map(node => renderNode(node))
      )}
    </div>
  )
}

// ─── helpers ───────────────────────────────────────────────────────────────

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    border: 'none',
    borderRadius: '4px',
    padding: '2px 5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.1s',
    height: '20px',
  }
}

function hoverIn(e: React.MouseEvent, color: string, isDelete = false) {
  const btn = e.currentTarget as HTMLButtonElement
  btn.style.background = color
  if (isDelete) btn.style.transform = 'scale(1.1)'
}

function hoverOut(e: React.MouseEvent, color: string) {
  const btn = e.currentTarget as HTMLButtonElement
  btn.style.background = color
  btn.style.transform = 'scale(1)'
}
