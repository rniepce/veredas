interface HeaderProps {
  onReset: () => void
  showReset: boolean
}

export function Header({ onReset, showReset }: HeaderProps) {
  return (
    <header>
      <div className="hi">
        <div className="ht">
          <div className="hbrand">
            <div className="hlogo-placeholder" />
            <div>
              <div className="htitle">VEREDAS</div>
              <div className="hsub">Sistema de Apoio à Sustentação Oral · TJMG</div>
            </div>
          </div>
          {showReset && (
            <button className="btu" onClick={onReset}>
              Carregar outro processo
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
