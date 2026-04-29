import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types'
import { sendChat } from '../services/api'
import { CollapsibleSection } from './CollapsibleSection'

export function ChatPanel({ processId }: { processId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await sendChat(processId, next)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setError('Falha ao obter resposta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    'Qual é a principal tese do recorrente?',
    'Houve preliminares rejeitadas?',
    'O que foi decidido em 1º grau?',
  ]

  return (
    <CollapsibleSection
      title="Chat com o Processo"
      variant="chat"
      icon="💬"
      defaultOpen={false}
    >
      <div className="chat-wrap">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-icon">💬</div>
              <div className="chat-empty-title">Pergunte sobre o processo</div>
              <div className="chat-empty-sub">
                {suggestions.map((s, i) => (
                  <span key={i}>
                    "{s}"{i < suggestions.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              <div className="bubble-label">
                {m.role === 'user' ? 'Magistrado' : 'Assistente IA'}
              </div>
              <div className="bubble-text">
                {m.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble assistant">
              <div className="bubble-label">Assistente IA</div>
              <div className="bubble-text typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          {error && <div className="chat-error">⚠ {error}</div>}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-row">
          <textarea
            className="chat-input"
            placeholder="Digite sua pergunta sobre o processo... (Enter para enviar, Shift+Enter para nova linha)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            disabled={loading}
          />
          <button
            className="chat-send"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
