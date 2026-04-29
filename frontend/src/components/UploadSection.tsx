import { useRef, useState } from 'react'

interface UploadSectionProps {
  onFile: (file: File) => void
  loading: boolean
  error: string | null
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
    <div className="upload-wrap">
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
            <div className="dz-title">Analisando processo...</div>
            <div className="dz-sub">Extraindo texto e processando com IA</div>
          </>
        ) : (
          <>
            <div className="dz-icon">⬆</div>
            <div className="dz-title">Arraste o PDF do processo aqui</div>
            <div className="dz-sub">ou clique para selecionar o arquivo</div>
            <div className="dz-hint">Arquivo PDF do e-proc · até 50 MB</div>
          </>
        )}
      </div>
      {error && <div className="upload-error">{error}</div>}
    </div>
  )
}
