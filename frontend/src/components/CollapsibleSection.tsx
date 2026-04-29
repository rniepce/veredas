import { useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  badge?: string | number
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  badge,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`c-section${open ? ' open' : ''}`}>
      <button className="c-header" onClick={() => setOpen((o) => !o)}>
        <span className="c-title">{title}</span>
        {badge !== undefined && <span className="c-badge">{badge}</span>}
        <span className="c-chev">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="c-body">{children}</div>}
    </div>
  )
}
