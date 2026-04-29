import { useEffect, useState } from 'react'
import { CollapsibleSection } from './CollapsibleSection'

export function NotasPanel({ processId }: { processId: string }) {
  const storageKey = `veredas-notas-${processId}`
  const [notas, setNotas] = useState(() => localStorage.getItem(storageKey) ?? '')

  useEffect(() => {
    const timer = setTimeout(() => localStorage.setItem(storageKey, notas), 500)
    return () => clearTimeout(timer)
  }, [notas, storageKey])

  return (
    <CollapsibleSection title="Observações do Magistrado" defaultOpen>
      <textarea
        className="notas-input"
        placeholder="Digite suas observações sobre o processo, a sustentação oral e os pontos a considerar no julgamento..."
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={5}
      />
      <div className="notas-hint">Salvo automaticamente no navegador</div>
    </CollapsibleSection>
  )
}
