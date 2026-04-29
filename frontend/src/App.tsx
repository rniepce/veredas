import { useState, useEffect } from 'react'
import type { AppState, ProcessData } from './types'
import { uploadPdf } from './services/api'
import { Header } from './components/Header'
import { UploadSection } from './components/UploadSection'
import { ProcessPanel } from './components/ProcessPanel'
import { TesesPanel } from './components/TesesPanel'
import { PreliminarsPanel } from './components/PreliminarsPanel'
import { DecisaoPanel } from './components/DecisaoPanel'
import { NotasPanel } from './components/NotasPanel'
import { ChatPanel } from './components/ChatPanel'
import { VotoPanel } from './components/VotoPanel'

export function App() {
  const [appState, setAppState] = useState<AppState>('splash')
  const [splashVisible, setSplashVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processId, setProcessId] = useState<string | null>(null)
  const [processData, setProcessData] = useState<ProcessData | null>(null)

  function enterApp() {
    setSplashVisible(false)
    setTimeout(() => setAppState('upload'), 700)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && appState === 'splash') enterApp()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [appState])

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    try {
      const result = await uploadPdf(file)
      setProcessId(result.process_id)
      setProcessData(result.data)
      setAppState('dashboard')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Erro ao processar o arquivo. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setProcessId(null)
    setProcessData(null)
    setError(null)
    setAppState('upload')
  }

  return (
    <>
      {/* Splash */}
      <div id="splash" className={splashVisible ? '' : 'hidden'}>
        <div className="sp-logo-mark">
          <span className="sp-logo-v">V</span>
        </div>
        <div className="sp-name">Veredas</div>
        <div className="sp-sub">Tribunal de Justiça de Minas Gerais</div>
        <div className="sp-div" />
        <button className="sp-btn" onClick={enterApp}>
          Iniciar Sessão
        </button>
        <div className="sp-foot">Sistema de Apoio à Sustentação Oral</div>
      </div>

      {appState !== 'splash' && (
        <>
          <Header onReset={handleReset} showReset={appState === 'dashboard'} />
          <main>
            {appState === 'upload' && (
              <UploadSection onFile={handleFile} loading={loading} error={error} />
            )}

            {appState === 'dashboard' && processData && processId && (
              <>
                <ProcessPanel data={processData} />
                <div className="dashboard-grid">
                  <TesesPanel teses={processData.teses ?? []} />
                  <PreliminarsPanel preliminares={processData.preliminares ?? []} />
                  <div className="dashboard-full">
                    <DecisaoPanel decisao={processData.sintese_decisao_1grau} />
                  </div>
                  <div className="dashboard-full">
                    <NotasPanel processId={processId} />
                  </div>
                  <div className="dashboard-full">
                    <VotoPanel />
                  </div>
                  <div className="dashboard-full">
                    <ChatPanel processId={processId} />
                  </div>
                </div>
              </>
            )}
          </main>
        </>
      )}
    </>
  )
}
