import type { ProcessData } from '../types'

function Cell({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="meta-cell">
      <div className="meta-lbl">{label}</div>
      <div className="meta-val">{value || '—'}</div>
    </div>
  )
}

export function ProcessPanel({ data }: { data: ProcessData }) {
  return (
    <div className="panel process-panel">
      <div className="panel-hero">
        <div className="panel-hero-sup">
          {data.tipo_recursal || 'Recurso'} · {data.camara || 'Câmara'}
        </div>
        <div className="panel-hero-num">{data.numero_processo || '—'}</div>
        {data.advogado_sustentante && (
          <div className="hero-pill">
            Sustentação Oral — {data.parte_sustentante || 'Parte'}
          </div>
        )}
      </div>
      <div className="meta-grid">
        <Cell label="Relator" value={data.relator} />
        <Cell label="Data da Sessão" value={data.data_sessao} />
        <Cell label="Recorrente" value={data.recorrente} />
        <Cell label="Recorrido" value={data.recorrido} />
        <Cell label="Advogado — Sust. Oral" value={data.advogado_sustentante} />
        <Cell label="Parte Sustentante" value={data.parte_sustentante} />
      </div>
    </div>
  )
}
