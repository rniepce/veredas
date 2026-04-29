import { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import mammoth from 'mammoth/mammoth.browser'
import { CollapsibleSection } from './CollapsibleSection'
import { copyAsPlainText, downloadAsDocx } from '../utils/votoExport'

export function VotoPanel() {
  const [content, setContent] = useState<string | null>(null)
  const [pasteText, setPasteText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function handleLoadHtml(html: string) {
    setContent(html)
    setError(null)
    setPasteText('')
  }

  async function handleDocxFile(file: File) {
    setBusy(true)
    setError(null)
    try {
      const buffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer })
      handleLoadHtml(result.value)
    } catch (e) {
      console.error(e)
      setError('Não foi possível ler o arquivo. Verifique se é um .docx válido.')
    } finally {
      setBusy(false)
    }
  }

  function handleLoadPaste() {
    const text = pasteText.trim()
    if (!text) return
    const html = text
      .split(/\n\s*\n/)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
      .join('')
    handleLoadHtml(html)
  }

  function handleReset() {
    setContent(null)
    setPasteText('')
    setError(null)
  }

  return (
    <CollapsibleSection
      title="Voto do Desembargador"
      variant="voto"
      icon="📝"
      defaultOpen={false}
    >
      {!content ? (
        <UploadView
          pasteText={pasteText}
          onPasteChange={setPasteText}
          onPasteLoad={handleLoadPaste}
          onFile={handleDocxFile}
          error={error}
          busy={busy}
        />
      ) : (
        <EditorView
          initialContent={content}
          onReset={handleReset}
        />
      )}
    </CollapsibleSection>
  )
}

function UploadView({
  pasteText,
  onPasteChange,
  onPasteLoad,
  onFile,
  error,
  busy,
}: {
  pasteText: string
  onPasteChange: (v: string) => void
  onPasteLoad: () => void
  onFile: (f: File) => void
  error: string | null
  busy: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="voto-upload">
      <div className="voto-upload-row">
        <button
          type="button"
          className="voto-btn primary"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? 'Carregando...' : 'Carregar arquivo .docx'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onFile(f)
            e.target.value = ''
          }}
        />
        <span className="voto-upload-or">ou</span>
        <span className="voto-upload-help">cole o texto do voto abaixo</span>
      </div>

      <textarea
        className="voto-paste"
        rows={8}
        placeholder="Cole aqui o texto do voto..."
        value={pasteText}
        onChange={(e) => onPasteChange(e.target.value)}
        disabled={busy}
      />

      <div className="voto-upload-actions">
        <button
          type="button"
          className="voto-btn"
          onClick={onPasteLoad}
          disabled={busy || !pasteText.trim()}
        >
          Usar texto colado
        </button>
      </div>

      {error && <div className="voto-error">⚠ {error}</div>}
    </div>
  )
}

function EditorView({
  initialContent,
  onReset,
}: {
  initialContent: string
  onReset: () => void
}) {
  const [copied, setCopied] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: false }),
    ],
    content: initialContent,
  })

  if (!editor) return null

  async function handleCopy() {
    if (!editor) return
    try {
      await copyAsPlainText(editor.getHTML())
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      console.error(e)
    }
  }

  function handleDownload() {
    if (!editor) return
    const ts = new Date().toISOString().slice(0, 10)
    downloadAsDocx(editor.getHTML(), `voto-${ts}.doc`)
  }

  return (
    <div className="voto-editor-wrap">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="voto-editor" />
      <div className="voto-actions">
        <button type="button" className="voto-btn" onClick={handleCopy}>
          {copied ? 'Copiado ✓' : 'Copiar texto'}
        </button>
        <button type="button" className="voto-btn" onClick={handleDownload}>
          Baixar .docx
        </button>
        <button type="button" className="voto-btn ghost" onClick={onReset}>
          Trocar voto
        </button>
      </div>
    </div>
  )
}

type EditorType = NonNullable<ReturnType<typeof useEditor>>

function Toolbar({ editor }: { editor: EditorType }) {
  const btn = (active: boolean, label: string, onClick: () => void, title: string) => (
    <button
      type="button"
      className={`tb-btn ${active ? 'on' : ''}`}
      onClick={onClick}
      title={title}
    >
      {label}
    </button>
  )

  return (
    <div className="voto-toolbar">
      {btn(editor.isActive('bold'), 'B', () => editor.chain().focus().toggleBold().run(), 'Negrito (Ctrl+B)')}
      {btn(editor.isActive('italic'), 'I', () => editor.chain().focus().toggleItalic().run(), 'Itálico (Ctrl+I)')}
      {btn(editor.isActive('underline'), 'U', () => editor.chain().focus().toggleUnderline().run(), 'Sublinhado (Ctrl+U)')}
      {btn(editor.isActive('strike'), 'S', () => editor.chain().focus().toggleStrike().run(), 'Riscado')}
      {btn(editor.isActive('highlight'), 'M', () => editor.chain().focus().toggleHighlight().run(), 'Marca-texto')}
      <span className="tb-sep" />
      {btn(editor.isActive('heading', { level: 2 }), 'H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Título')}
      {btn(editor.isActive('bulletList'), '•', () => editor.chain().focus().toggleBulletList().run(), 'Lista')}
      {btn(editor.isActive('orderedList'), '1.', () => editor.chain().focus().toggleOrderedList().run(), 'Lista numerada')}
      {btn(editor.isActive('blockquote'), '"', () => editor.chain().focus().toggleBlockquote().run(), 'Citação')}
      <span className="tb-sep" />
      <button
        type="button"
        className="tb-btn"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Desfazer (Ctrl+Z)"
      >
        ↶
      </button>
      <button
        type="button"
        className="tb-btn"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Refazer (Ctrl+Y)"
      >
        ↷
      </button>
    </div>
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
