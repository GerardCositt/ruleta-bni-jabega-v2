import { useState, useEffect } from 'react'
import { miembrosApi, sorteoApi, Miembro } from '../api'
import './Backdoor.css'

const Backdoor = () => {
  const [autenticado, setAutenticado] = useState(false)
  const [password, setPassword] = useState('')
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [miembroSeleccionado, setMiembroSeleccionado] = useState<number | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (autenticado) {
      cargarMiembros()
    }
  }, [autenticado])

  const verificarPassword = () => {
    // La verificación real se hace en el backend
    // Por ahora solo verificamos que haya contraseña
    if (password.trim()) {
      setAutenticado(true)
    }
  }

  const cargarMiembros = async () => {
    try {
      const response = await miembrosApi.getAll(true)
      setMiembros(response.data)
    } catch (error) {
      console.error('Error cargando miembros:', error)
    }
  }

  const forzarGanador = async () => {
    if (!miembroSeleccionado || !password) {
      alert('Selecciona un miembro e ingresa la contraseña')
      return
    }

    setCargando(true)
    try {
      const response = await sorteoApi.manual(miembroSeleccionado, password)
      alert(`Ganador forzado: ${response.data.ganador_nombre}`)
      setMiembroSeleccionado(null)
      setPassword('')
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Contraseña incorrecta')
        setAutenticado(false)
        setPassword('')
      } else {
        alert('Error al forzar ganador')
      }
    } finally {
      setCargando(false)
    }
  }

  if (!autenticado) {
    return (
      <div className="backdoor-container">
        <div className="backdoor-login">
          <h2>🔐 Puerta Trasera</h2>
          <p className="advertencia">Acceso restringido</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verificarPassword()}
            autoFocus
          />
          <button onClick={verificarPassword}>Acceder</button>
        </div>
      </div>
    )
  }

  return (
    <div className="backdoor-container">
      <h1>🔐 Control de Ganador</h1>
      <p className="instrucciones">
        Selecciona el miembro que quieres que gane y confirma con la contraseña
      </p>

      <div className="backdoor-content">
        <div className="selector-miembros">
          <h3>Seleccionar Ganador</h3>
          <div className="lista-miembros-backdoor">
            {miembros.map((miembro) => (
              <button
                key={miembro.id}
                className={`miembro-btn ${miembroSeleccionado === miembro.id ? 'seleccionado' : ''}`}
                onClick={() => setMiembroSeleccionado(miembro.id)}
              >
                {miembro.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="confirmacion">
          <h3>Confirmar</h3>
          {miembroSeleccionado && (
            <p className="ganador-seleccionado">
              Ganador seleccionado: <strong>{miembros.find(m => m.id === miembroSeleccionado)?.nombre}</strong>
            </p>
          )}
          <input
            type="password"
            placeholder="Contraseña de backdoor"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn-forzar"
            onClick={forzarGanador}
            disabled={!miembroSeleccionado || !password || cargando}
          >
            {cargando ? 'Procesando...' : 'Forzar Ganador'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Backdoor
