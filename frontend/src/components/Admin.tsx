import { useState, useEffect } from 'react'
import { miembrosApi, authApi, Miembro } from '../api'
import './Admin.css'

const Admin = () => {
  const [autenticado, setAutenticado] = useState(false)
  const [password, setPassword] = useState('')
  const [miembros, setMiembros] = useState<Miembro[]>([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [nombreEdit, setNombreEdit] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAutenticado(true)
      cargarMiembros()
    }
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    try {
      const response = await authApi.login(password)
      localStorage.setItem('token', response.data.access_token)
      setAutenticado(true)
      cargarMiembros()
      setPassword('')
    } catch (error: any) {
      alert('Contraseña incorrecta')
    } finally {
      setCargando(false)
    }
  }

  const cargarMiembros = async () => {
    try {
      const response = await miembrosApi.getAll()
      setMiembros(response.data)
    } catch (error) {
      console.error('Error cargando miembros:', error)
    }
  }

  const agregarMiembro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return

    try {
      await miembrosApi.create(nuevoNombre.trim())
      setNuevoNombre('')
      cargarMiembros()
    } catch (error) {
      console.error('Error agregando miembro:', error)
      alert('Error al agregar miembro')
    }
  }

  const iniciarEdicion = (miembro: Miembro) => {
    setEditando(miembro.id)
    setNombreEdit(miembro.nombre)
  }

  const guardarEdicion = async (id: number) => {
    try {
      await miembrosApi.update(id, { nombre: nombreEdit.trim() })
      setEditando(null)
      cargarMiembros()
    } catch (error) {
      console.error('Error actualizando miembro:', error)
      alert('Error al actualizar miembro')
    }
  }

  const eliminarMiembro = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return

    try {
      await miembrosApi.delete(id)
      cargarMiembros()
    } catch (error) {
      console.error('Error eliminando miembro:', error)
      alert('Error al eliminar miembro')
    }
  }

  const toggleActivo = async (miembro: Miembro) => {
    try {
      await miembrosApi.update(miembro.id, { activo: !miembro.activo })
      cargarMiembros()
    } catch (error) {
      console.error('Error actualizando estado:', error)
    }
  }

  if (!autenticado) {
    return (
      <div className="admin-container">
        <div className="login-box">
          <h2>Panel de Administración</h2>
          <form onSubmit={login}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={cargando}>
              {cargando ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <h1>Gestión de Miembros</h1>

      <form onSubmit={agregarMiembro} className="form-agregar">
        <input
          type="text"
          placeholder="Nombre del miembro"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          required
        />
        <button type="submit">Agregar Miembro</button>
      </form>

      <div className="lista-miembros">
        {miembros.length === 0 ? (
          <p className="sin-miembros">No hay miembros registrados</p>
        ) : (
          miembros.map((miembro) => (
            <div key={miembro.id} className="miembro-item">
              {editando === miembro.id ? (
                <div className="editando">
                  <input
                    type="text"
                    value={nombreEdit}
                    onChange={(e) => setNombreEdit(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => guardarEdicion(miembro.id)}>✓</button>
                  <button onClick={() => setEditando(null)}>✗</button>
                </div>
              ) : (
                <>
                  <span className={`nombre ${!miembro.activo ? 'inactivo' : ''}`}>
                    {miembro.nombre}
                  </span>
                  <div className="acciones">
                    <button
                      className={`btn-activo ${miembro.activo ? 'activo' : 'inactivo'}`}
                      onClick={() => toggleActivo(miembro)}
                    >
                      {miembro.activo ? 'Activo' : 'Inactivo'}
                    </button>
                    <button onClick={() => iniciarEdicion(miembro)}>Editar</button>
                    <button onClick={() => eliminarMiembro(miembro.id)} className="btn-eliminar">
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Admin
