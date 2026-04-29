import { useEffect, useState } from 'react'
import { CollapsibleSection } from './CollapsibleSection'

export function NotasPanel({ processId }: { processId: string }) {
  const storageKey = `veredas-notas-${processId}`
  const [notas, setNotas] = useState(() => localStorage.getItem(storageKey) ?? '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, notas)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 600)
    return () => clearTimeout(timer)
  }, [notas, storageKey])

  return (
    <CollapsibleSection
      title="Observações do Magistrado"
      variant="notas"
      icon="✏"
      defaultOpen
    >
      <textarea
        className="notas-input"
        placeholder="Registre aqui suas observações sobre o processo, pontos relevantes da sustentação oral e considerações para o julgamento..."
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        rows={5}
      />
      <div className="notas-footer">
        <span className={`notas-saved${saved ? ' visible' : ''}`}>✓ Salvo</span>
        <span className="notas-hint">Salvo automaticamente no navegador</span>
      </div>
    </CollapsibleSection>
  )
}
