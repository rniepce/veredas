import { useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  badge?: string | number
  defaultOpen?: boolean
  variant?: 'teses' | 'preliminares' | 'decisao' | 'notas' | 'chat' | 'voto'
  icon?: string
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  badge,
  defaultOpen = true,
  variant = 'teses',
  icon,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`c-section ${variant}${open ? ' open' : ''}`}>
      <button className="c-header" onClick={() => setOpen((o) => !o)}>
        {icon && <div className="c-icon">{icon}</div>}
        <span className="c-title">{title}</span>
        {badge !== undefined && badge !== 0 && (
          <span className="c-badge">{badge}</span>
        )}
        <span className="c-chev">▼</span>
      </button>
      {open && <div className="c-body">{children}</div>}
    </div>
  )
}
