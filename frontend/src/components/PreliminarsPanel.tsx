import { CollapsibleSection } from './CollapsibleSection'

export function PreliminarsPanel({ preliminares }: { preliminares: string[] }) {
  return (
    <CollapsibleSection
      title="Preliminares"
      badge={preliminares.length}
      variant="preliminares"
      icon="📋"
      defaultOpen
    >
      {preliminares.length === 0 ? (
        <p className="empty-msg">Nenhuma preliminar identificada no processo.</p>
      ) : (
        <ul className="item-list">
          {preliminares.map((p, i) => (
            <li key={i} className="item-row">
              <span className="item-bullet">·</span>
              <span className="item-text">{p}</span>
            </li>
          ))}
        </ul>
      )}
    </CollapsibleSection>
  )
}
