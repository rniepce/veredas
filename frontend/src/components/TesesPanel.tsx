import { CollapsibleSection } from './CollapsibleSection'

export function TesesPanel({ teses }: { teses: string[] }) {
  return (
    <CollapsibleSection title="Teses do Recurso" badge={teses.length} defaultOpen>
      {teses.length === 0 ? (
        <p className="empty-msg">Nenhuma tese identificada no processo.</p>
      ) : (
        <ol className="item-list">
          {teses.map((t, i) => (
            <li key={i} className="item-row">
              <span className="item-idx">{i + 1}</span>
              <span className="item-text">{t}</span>
            </li>
          ))}
        </ol>
      )}
    </CollapsibleSection>
  )
}
