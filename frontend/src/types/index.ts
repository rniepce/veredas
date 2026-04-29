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
  teses: string[]
  preliminares: string[]
  sintese_decisao_1grau: string | null
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export type AppState = 'splash' | 'upload' | 'loading' | 'dashboard'
