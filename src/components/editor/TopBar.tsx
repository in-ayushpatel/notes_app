'use client'

import { useEditorStore } from '@/store/editorStore'
import { useTreeStore } from '@/store/treeStore'

type ViewMode = 'edit' | 'rich' | 'split' | 'preview'

interface TopBarProps {
  viewMode: ViewMode
  onSetMode: (m: ViewMode) => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  isMobile: boolean
}

const MODES: { mode: ViewMode; icon: string; title: string }[] = [
  { mode: 'edit',    icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', title: 'Raw Markdown' },
  { mode: 'rich',    icon: 'M12 3l1.912 5.813 6.088.031-4.903 3.639 1.859 5.864-4.956-3.567-4.956 3.567 1.859-5.864-4.903-3.639 6.088-.031z', title: 'Rich Editor' },
  { mode: 'split',   icon: 'M3 3h18v18H3z M12 3v18', title: 'Side-by-side' },
  { mode: 'preview', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', title: 'Preview only' },
]

export function TopBar({ viewMode, onSetMode, sidebarCollapsed, onToggleSidebar, isMobile }: TopBarProps) {
  const { openNote, saveStatus, saveNote, isDirty } = useEditorStore()
  const { selectedRepo } = useTreeStore()

  const breadcrumb = openNote?.path
    ? openNote.path.replace(/^notes\//, '').replace('.md', '').split('/').join(' / ')
    : null

  const statusLabel = (() => {
    if (saveStatus.status === 'saving') return { label: 'Saving...', color: 'var(--warning)', dot: true }
    if (saveStatus.status === 'saved')  return { label: 'Saved',     color: 'var(--success)', dot: false }
    if (saveStatus.status === 'error')  return { label: saveStatus.message ?? 'Error', color: 'var(--danger)', dot: false }
    if (isDirty) return { label: 'Unsaved', color: 'var(--text-muted)', dot: false }
    return null
  })()

  return (
    <div style={{
      height: '48px', flexShrink: 0,
      background: 'rgba(22,27,34,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '12px',
    }}>
      {/* Hamburger & App Icon (only when sidebar is collapsed on mobile or desktop) */}
      {sidebarCollapsed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '6px' }}>
          <button
            onClick={onToggleSidebar}
            title="Expand Sidebar"
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '4px',
              transition: 'background 0.1s, color 0.1s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
            <span style={{ fontSize: '18px' }}>🧠</span>
            {!isMobile && <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>DevNotes</span>}
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{selectedRepo?.fullName}</span>
            <span style={{ margin: '0 6px' }}>·</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{breadcrumb}</span>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {selectedRepo ? `${selectedRepo.fullName} · Select a note` : 'No repo selected'}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Save status */}
        {statusLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: statusLabel.color }}>
            {statusLabel.dot && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusLabel.color, animation: 'pulse-dot 1s infinite' }} />
            )}
            {!isMobile && statusLabel.label}
          </div>
        )}

        {openNote && (
          <>
            {/* ⌘S */}
            <button
              onClick={saveNote}
              title="Save (⌘S)"
              disabled={!isDirty}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '5px 10px', fontSize: '11px',
                color: isDirty ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: isDirty ? 'pointer' : 'default', transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (isDirty) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
            >⌘S</button>

            {/* View mode buttons */}
            <div style={{
              display: 'flex', background: 'var(--bg-tertiary)', padding: '2px', borderRadius: '8px',
              border: '1px solid var(--border)', flexShrink: 0,
            }}>
              {MODES.filter(m => !isMobile || m.mode !== 'split').map(({ mode, icon, title }, i) => {
                const active = viewMode === mode
                return (
                  <button
                    key={mode}
                    onClick={() => onSetMode(mode)}
                    title={title}
                    style={{
                      background: active ? 'var(--accent-subtle)' : 'transparent',
                      border: active ? '1px solid rgba(88,166,255,0.4)' : '1px solid transparent',
                      borderRadius: '6px',
                      width: '32px', height: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: active ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)' }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon} />
                    </svg>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
