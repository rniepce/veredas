import { useState } from 'react'
import { CollapsibleSection } from './CollapsibleSection'
import type { Tese } from '../types'

export function TesesPanel({ teses }: { teses: Tese[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIdx(openIdx === i ? null : i)
  }

  return (
    <CollapsibleSection
      title="Teses do Recurso"
      badge={teses.length}
      variant="teses"
      icon="⚖"
      defaultOpen
    >
      {teses.length === 0 ? (
        <p className="empty-msg">Nenhuma tese identificada no processo.</p>
      ) : (
        <ol className="item-list">
          {teses.map((t, i) => {
            const isOpen = openIdx === i
            return (
              <li key={i} className={`tese-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="tese-header"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className="item-idx">{i + 1}</span>
                  <span className="item-text">{t.tese}</span>
                  <span className="tese-caret" aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <div className="tese-body">
                    {t.fundamento_legal && (
                      <div className="tese-row">
                        <span className="tese-label">Fundamento legal</span>
                        <span className="tese-value">{t.fundamento_legal}</span>
                      </div>
                    )}
                    {t.fato_relevante && (
                      <div className="tese-row">
                        <span className="tese-label">Fato relevante</span>
                        <span className="tese-value">{t.fato_relevante}</span>
                      </div>
                    )}
                    {t.jurisprudencia && (
                      <div className="tese-row">
                        <span className="tese-label">Jurisprudência</span>
                        <span className="tese-value">{t.jurisprudencia}</span>
                      </div>
                    )}
                    {!t.fundamento_legal && !t.fato_relevante && !t.jurisprudencia && (
                      <p className="empty-msg">Razões não detalhadas no recurso.</p>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </CollapsibleSection>
  )
}
