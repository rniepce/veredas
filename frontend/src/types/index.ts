export interface Tese {
  tese: string
  fundamento_legal: string | null
  fato_relevante: string | null
  jurisprudencia: string | null
}

export interface DocumentoCitado {
  id: string
  descricao: string
}

export interface DecisaoPrimeiroGrau {
  texto: string | null
  documentos: DocumentoCitado[]
}

export interface ProcessData {
  numero_processo: string | null
  tipo_recursal: string | null
  camara: string | null
  relator: string | null
  data_sessao: string | null
  recorrente: string | null
  recorrido: string | null
  advogado_sustentante: string | null
  parte_sustentante: string | null
  teses: Tese[]
  preliminares: string[]
  sintese_decisao_1grau: DecisaoPrimeiroGrau | null
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export type AppState = 'splash' | 'upload' | 'loading' | 'dashboard'
