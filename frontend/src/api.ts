import axios from 'axios'

// Usar variable de entorno en producción, o '/api' en desarrollo
const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Miembro {
  id: number
  nombre: string
  activo: boolean
  created_at: string
}

export interface Ganador {
  id: number
  miembro_id: number
  miembro_nombre: string
  fecha_sorteo: string
  manipulada: boolean
}

export interface Estadistica {
  miembro_id: number
  miembro_nombre: string
  total_ganados: number
  ultima_vez: string | null
}

export interface SorteoResponse {
  ganador_id: number
  ganador_nombre: string
  manipulada: boolean
}

export const miembrosApi = {
  getAll: (activo?: boolean) => api.get<Miembro[]>('/miembros', { params: { activo } }),
  getById: (id: number) => api.get<Miembro>(`/miembros/${id}`),
  create: (nombre: string, activo: boolean = true) => 
    api.post<Miembro>('/miembros', { nombre, activo }),
  update: (id: number, data: Partial<Miembro>) => 
    api.put<Miembro>(`/miembros/${id}`, data),
  delete: (id: number) => api.delete(`/miembros/${id}`),
}

export const sorteoApi = {
  realizar: (password?: string) => 
    api.post<SorteoResponse>('/sorteo', password ? { password } : {}),
  manual: (miembro_id: number, password: string) =>
    api.post<SorteoResponse>('/sorteo/manual', { miembro_id, password }),
}

export const estadisticasApi = {
  getEstadisticas: () => api.get<Estadistica[]>('/estadisticas'),
  getGanadores: (limit: number = 50) => 
    api.get<Ganador[]>('/ganadores', { params: { limit } }),
}

export const authApi = {
  login: (password: string) => 
    api.post<{ access_token: string; token_type: string }>('/auth/login', { password }),
}

export default api
