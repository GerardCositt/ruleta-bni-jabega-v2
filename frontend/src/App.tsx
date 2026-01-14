import { Routes, Route, Link } from 'react-router-dom'
import Ruleta from './components/Ruleta'
import Admin from './components/Admin'
import Estadisticas from './components/Estadisticas'
import Backdoor from './components/Backdoor'
import './App.css'
import './components/MarFondo.css'

function App() {
  return (
    <>
      <div className="mar-fondo">
        <div className="ola-capa-1"></div>
        <div className="ola-capa-2"></div>
        <div className="ola-capa-3"></div>
        <div className="ola-capa-4"></div>
        <div className="ola-capa-5"></div>
        <div className="ola-capa-6"></div>
        <div className="brillo-sol"></div>
      </div>
      <div className="app">
        <nav className="nav">
          <Link to="/" className="nav-link">Ruleta</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
          <Link to="/stats" className="nav-link">Estadísticas</Link>
          <Link to="/backdoor" className="nav-link backdoor-link">🔐</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Ruleta />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/stats" element={<Estadisticas />} />
          <Route path="/backdoor" element={<Backdoor />} />
        </Routes>
      </div>
    </>
  )
}

export default App
