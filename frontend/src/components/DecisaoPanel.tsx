import { CollapsibleSection } from './CollapsibleSection'

export function DecisaoPanel({ sintese }: { sintese: string | null }) {
  return (
    <CollapsibleSection
      title="Decisão de 1º Grau"
      variant="decisao"
      icon="🏛"
      defaultOpen
    >
      {sintese ? (
        <p className="decisao-text">{sintese}</p>
      ) : (
        <p className="empty-msg">Síntese da decisão não identificada no processo.</p>
      )}
    </CollapsibleSection>
  )
}
