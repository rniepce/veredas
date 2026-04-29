import { CollapsibleSection } from './CollapsibleSection'
import type { DecisaoPrimeiroGrau } from '../types'

export function DecisaoPanel({ decisao }: { decisao: DecisaoPrimeiroGrau | null }) {
  const texto = decisao?.texto ?? null
  const documentos = decisao?.documentos ?? []

  return (
    <CollapsibleSection
      title="Decisão de 1º Grau"
      variant="decisao"
      icon="🏛"
      defaultOpen
    >
      {texto ? (
        <p className="decisao-text">{texto}</p>
      ) : (
        <p className="empty-msg">Síntese da decisão não identificada no processo.</p>
      )}

      {documentos.length > 0 && (
        <div className="docs-block">
          <div className="docs-title">Documentos citados</div>
          <ul className="docs-list">
            {documentos.map((d, i) => (
              <li key={i} className="docs-item">
                <span className="docs-id">{d.id}</span>
                <span className="docs-desc">{d.descricao}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleSection>
  )
}
