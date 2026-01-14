import './Jabega.css'

interface JabegaProps {
  nombre: string
  genero: 'masculino' | 'femenino'
}

const Jabega = ({ nombre, genero }: JabegaProps) => {
  return (
    <div className="jabega-container">
      <div className="mar">
        <div className="ola ola1"></div>
        <div className="ola ola2"></div>
        <div className="ola ola3"></div>
      </div>
      
      <div className="jabega">
        {/* Barca */}
        <div className="barca">
          <div className="proa"></div>
          <div className="cuerpo-barca"></div>
          <div className="popa"></div>
        </div>
        
        {/* Persona */}
        <div className={`persona ${genero}`}>
          <div className="cabeza">
            <div className="cara">
              {genero === 'femenino' && <div className="pelo"></div>}
            </div>
          </div>
          <div className="cuerpo">
            <div className="brazo-izq">
              <div className="remo-izq"></div>
            </div>
            <div className="torso"></div>
            <div className="brazo-der">
              <div className="remo-der"></div>
            </div>
          </div>
        </div>
        
        {/* Remos en el agua */}
        <div className="remo-agua remo-izq-agua"></div>
        <div className="remo-agua remo-der-agua"></div>
      </div>
      
      <div className="nombre-jabega">{nombre}</div>
    </div>
  )
}

export default Jabega
