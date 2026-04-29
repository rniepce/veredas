import { useRef, useState } from 'react'

interface UploadSectionProps {
  onFile: (file: File) => void
  loading: boolean
  error: string | null
}

function UploadIcon() {
  return (
    <svg className="dz-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

export function UploadSection({ onFile, loading, error }: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.toLowerCase().endsWith('.pdf')) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="upload-page">
      <div className="upload-eyebrow">TJMG · Câmara Cível</div>
      <h1 className="upload-heading">Carregar Processo</h1>
      <p className="upload-sub">Faça o upload do PDF do e-proc para iniciar a análise</p>

      <div
        className={`dropzone${dragging ? ' dragging' : ''}${loading ? ' uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        {loading ? (
          <>
            <div className="dz-spinner" />
            <div className="dz-title">Analisando processo</div>
            <div className="dz-sub">Extraindo texto e processando com IA...</div>
          </>
        ) : (
          <>
            <div className="dz-icon-wrap">
              <UploadIcon />
            </div>
            <div className="dz-title">Arraste o PDF aqui</div>
            <div className="dz-sub">ou clique para selecionar o arquivo</div>
            <span className="dz-hint">PDF do e-proc · até 50 MB</span>
          </>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  )
}
