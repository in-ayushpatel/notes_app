'use client'

import { useState, useMemo, useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'

export function TocPanel({ showDesktop }: { showDesktop: boolean }) {
  const { openNote } = useEditorStore()
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track window resize for mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Parse headings from markdown content
  const headings = useMemo(() => {
    if (!openNote?.content) return []
    const lines = openNote.content.split('\n')
    const parsed = []
    
    // basic regex to match # Heading
    const regex = /^(#{1,6})\s+(.+)$/
    for (const line of lines) {
      const match = line.match(regex)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text.toLowerCase().replace(/[^\w]+/g, '-')
        parsed.push({ level, text, id })
      }
    }
    return parsed
  }, [openNote?.content])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpenMobile(false)
  }

  // Mobile layout state (Floating Action Button + Modal)
  if (isMobile) {
    if (!openNote) return null

    return (
      <>
        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpenMobile(true)}
          title="Table of Contents"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 100,
          }}
        >
          ≣
        </button>

        {/* Mobile Full-Screen/Bottom-Sheet Modal */}
        {isOpenMobile && (
          <div
            onClick={() => setIsOpenMobile(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxHeight: '80vh',
                background: 'var(--bg-secondary)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                padding: '24px',
                overflowY: 'auto',
                boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
                animation: 'slideUp 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px' }}>Table of Contents</h3>
                <button 
                  onClick={() => setIsOpenMobile(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', padding: '4px' }}
                >×</button>
              </div>

              {headings.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
                  No headings found in this note.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {headings.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToHeading(h.id)}
                      style={{
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        padding: '6px 0',
                        fontSize: '14px',
                        paddingLeft: `${(h.level - 1) * 12}px`,
                        borderBottom: '1px solid var(--border-subtle)',
                        opacity: 1 - (h.level - 1) * 0.15,
                      }}
                    >
                      {h.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop layout state (Right Sidebar)
  if (!showDesktop) return null

  return (
    <div style={{
      width: '220px',
      height: '100%',
      borderLeft: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        fontWeight: '600',
        fontSize: '13px',
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Outline
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {!openNote ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Open a note to see outline.</div>
        ) : headings.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>No headings found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {headings.map((h, i) => (
              <button
                key={i}
                onClick={() => scrollToHeading(h.id)}
                style={{
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  padding: '4px 0',
                  paddingLeft: `${(h.level - 1) * 12}px`,
                  opacity: 1 - (h.level - 1) * 0.15,
                  cursor: 'pointer',
                  borderLeft: '2px solid transparent',
                  transition: 'color 0.1s, border-left-color 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.borderLeftColor = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                }}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
