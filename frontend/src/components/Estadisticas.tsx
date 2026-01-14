import { useState, useEffect } from 'react'
import { estadisticasApi, Estadistica, Ganador } from '../api'
import './Estadisticas.css'

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([])
  const [ganadores, setGanadores] = useState<Ganador[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [estadisticasRes, ganadoresRes] = await Promise.all([
        estadisticasApi.getEstadisticas(),
        estadisticasApi.getGanadores(20)
      ])
      setEstadisticas(estadisticasRes.data)
      setGanadores(ganadoresRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setCargando(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (cargando) {
    return <div className="estadisticas-container">Cargando estadísticas...</div>
  }

  return (
    <div className="estadisticas-container">
      <h1>Estadísticas de Ganadores</h1>

      <div className="estadisticas-grid">
        <div className="estadisticas-box">
          <h2>Ranking de Ganadores</h2>
          {estadisticas.length === 0 ? (
            <p className="sin-datos">Aún no hay ganadores</p>
          ) : (
            <div className="ranking">
              {estadisticas.map((stat, index) => (
                <div key={stat.miembro_id} className="ranking-item">
                  <div className="ranking-posicion">#{index + 1}</div>
                  <div className="ranking-info">
                    <div className="ranking-nombre">{stat.miembro_nombre}</div>
                    <div className="ranking-datos">
                      <span className="total-ganados">{stat.total_ganados} {stat.total_ganados === 1 ? 'vez' : 'veces'}</span>
                      {stat.ultima_vez && (
                        <span className="ultima-vez">Última: {formatearFecha(stat.ultima_vez)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="estadisticas-box">
          <h2>Historial Reciente</h2>
          {ganadores.length === 0 ? (
            <p className="sin-datos">Aún no hay ganadores</p>
          ) : (
            <div className="historial">
              {ganadores.map((ganador) => (
                <div key={ganador.id} className="historial-item">
                  <div className="historial-nombre">{ganador.miembro_nombre}</div>
                  <div className="historial-fecha">{formatearFecha(ganador.fecha_sorteo)}</div>
                  {ganador.manipulada && (
                    <span className="manipulada-badge">Manipulada</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Estadisticas
