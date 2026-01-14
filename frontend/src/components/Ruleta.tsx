import { useState, useEffect } from 'react'
import { miembrosApi, sorteoApi, Miembro, SorteoResponse } from '../api'
import confetti from 'canvas-confetti'
import Jabega from './Jabega'
import './Ruleta.css'

const Ruleta = () => {
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [girando, setGirando] = useState(false)
  const [ganador, setGanador] = useState<string | null>(null)
  const [angulo, setAngulo] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [mostrarJabega, setMostrarJabega] = useState(false)

  // Detectar género del nombre (nombres comunes en español)
  const detectarGenero = (nombre: string): 'masculino' | 'femenino' => {
    const nombreLimpio = nombre.split(' ')[0].toLowerCase()
    
    const nombresFemeninos = [
      'maría', 'ana', 'laura', 'carmen', 'elena', 'lucía', 'sofía', 'paula',
      'marta', 'natalia', 'andrea', 'cristina', 'beatriz', 'eva', 'claudia',
      'patricia', 'mónica', 'silvia', 'teresa', 'isabel'
    ]
    
    if (nombresFemeninos.includes(nombreLimpio)) {
      return 'femenino'
    }
    return 'masculino'
  }

  const lanzarConfeti = (nombre: string) => {
    const duracion = 5000
    const animacion = confetti
    
    const intervalo = setInterval(() => {
      // Confeti desde arriba - más cantidad
      animacion({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.1 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ffd700', '#eb4d4b', '#6c5ce7', '#a29bfe', '#00b894', '#00cec9', '#fd79a8', '#fdcb6e']
      })
      
      // Confeti desde la izquierda - más cantidad
      animacion({
        particleCount: 100,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ['#ffd700', '#f9ca24', '#ff6b6b', '#eb4d4b', '#6c5ce7']
      })
      
      // Confeti desde la derecha - más cantidad
      animacion({
        particleCount: 100,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ['#ffd700', '#f9ca24', '#4ecdc4', '#45b7d1', '#00b894']
      })
      
      // Confeti desde el centro hacia afuera - más cantidad
      animacion({
        particleCount: 150,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ffd700', '#eb4d4b', '#6c5ce7', '#a29bfe', '#00b894', '#00cec9']
      })
      
      // Confeti adicional desde abajo hacia arriba
      animacion({
        particleCount: 80,
        angle: 270,
        spread: 70,
        origin: { x: 0.5, y: 1 },
        colors: ['#ffd700', '#f9ca24', '#ff6b6b', '#4ecdc4', '#6c5ce7']
      })
    }, 200)
    
    setTimeout(() => clearInterval(intervalo), duracion)
  }

  useEffect(() => {
    cargarMiembros()
  }, [])

  const cargarMiembros = async () => {
    try {
      const response = await miembrosApi.getAll(true)
      setMiembros(response.data)
      setCargando(false)
    } catch (error) {
      console.error('Error cargando miembros:', error)
      setCargando(false)
    }
  }

  const girarRuleta = async () => {
    if (girando || miembros.length === 0) return

    setGirando(true)
    setGanador(null)

    try {
      const response = await sorteoApi.realizar()
      const resultado: SorteoResponse = response.data

      // Calcular ángulo de giro (múltiplos de 360 + posición del ganador)
      const indiceGanador = miembros.findIndex(m => m.id === resultado.ganador_id)
      const anguloPorItem = 360 / miembros.length
      const anguloGanador = indiceGanador * anguloPorItem
      const giros = 5 // Número de vueltas completas
      const anguloFinal = angulo + (giros * 360) + (360 - anguloGanador)

      setAngulo(anguloFinal)

      // Esperar a que termine la animación
      setTimeout(() => {
        setGanador(resultado.ganador_nombre)
        setGirando(false)
        lanzarConfeti(resultado.ganador_nombre)
        setMostrarJabega(true)
        
        // Ocultar jábega después de 5 segundos
        setTimeout(() => {
          setMostrarJabega(false)
        }, 5000)
      }, 3000)
    } catch (error) {
      console.error('Error en el sorteo:', error)
      setGirando(false)
    }
  }

  if (cargando) {
    return <div className="ruleta-container">Cargando miembros...</div>
  }

  if (miembros.length === 0) {
    return (
      <div className="ruleta-container">
        <div className="mensaje">No hay miembros activos. Ve a Admin para agregar miembros.</div>
      </div>
    )
  }

  const anguloPorItem = 360 / miembros.length

  // Colores para la ruleta
  const colores = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
    '#eb4d4b', '#6c5ce7', '#a29bfe', '#00b894', '#00cec9',
    '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff', '#0984e3',
    '#55efc4', '#81ecec', '#fab1a0', '#ffeaa7', '#dfe6e9'
  ]

  // Generar gradiente conic dinámico
  const generarGradiente = () => {
    let gradiente = 'conic-gradient(from 0deg, '
    miembros.forEach((_, index) => {
      const color = colores[index % colores.length]
      const inicio = index * anguloPorItem
      const fin = (index + 1) * anguloPorItem
      gradiente += `${color} ${inicio}deg ${fin}deg`
      if (index < miembros.length - 1) gradiente += ', '
    })
    gradiente += ')'
    return gradiente
  }

  return (
    <div className="ruleta-container">
      <h1 className="titulo">Ruleta de Sorteos BNI Jábega</h1>
      
      <div className="ruleta-wrapper">
        <div 
          className={`ruleta ${girando ? 'girando' : ''}`}
          style={{ 
            transform: `rotate(${angulo}deg)`,
            background: generarGradiente()
          }}
        >
          {miembros.map((miembro, index) => {
            const rotacion = index * anguloPorItem
            const anguloTexto = anguloPorItem / 2
            // Ajustar tamaño de fuente según número de miembros
            const fontSize = miembros.length > 30 ? '0.75rem' : miembros.length > 20 ? '0.85rem' : '0.95rem'
            return (
              <div
                key={miembro.id}
                className="segmento"
                style={{
                  transform: `rotate(${rotacion}deg)`,
                  '--angulo': `${anguloPorItem}deg`
                } as React.CSSProperties}
              >
                <div 
                  className="segmento-texto" 
                  style={{ 
                    transform: `rotate(${anguloTexto}deg)`,
                    fontSize: fontSize
                  }}
                >
                  {miembro.nombre}
                </div>
              </div>
            )
          })}
        </div>
        <div className="puntero"></div>
      </div>

      <button 
        className="btn-girar" 
        onClick={girarRuleta} 
        disabled={girando}
      >
        {girando ? 'Girando...' : 'Girar Ruleta'}
      </button>

      {ganador && (
        <div className="ganador">
          <h2>¡Ganador!</h2>
          <div className="ganador-nombre">{ganador}</div>
        </div>
      )}

      {mostrarJabega && ganador && (
        <Jabega nombre={ganador} genero={detectarGenero(ganador)} />
      )}
    </div>
  )
}

export default Ruleta
