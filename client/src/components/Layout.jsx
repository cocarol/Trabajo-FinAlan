import { Link, useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function Layout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    const token = localStorage.getItem('token')
    let rol = 'paciente'
    try { rol = jwtDecode(token)?.role || 'paciente'
    } catch {}

    const esMedico = rol === 'medico'

    return (
        <div className="app-layout">
            <header className="topbar">
                <Link to="/mis-turnos" className="topbar-brand">
                    <span className="cruz"></span>
                    Turnos Salud
                </Link>

                <nav className="topbar-nav">
                    {!esMedico && (
                        <Link className="topbar-link" to="/reservar">Reservar turno</Link>
                    )}
                    
                    {rol === 'paciente' && (
                        <>
                            <Link className={`topbar-link ${isActive('/mis-turnos') ? 'active' : ''}`} to="/mis-turnos">Mis turnos</Link>
                        </>
                    )}

                    {rol === 'medico' && (
                        <>
                            <Link className={`topbar-link ${isActive('/medico/panel') ? 'active' : ''}`} to="/medico/panel">Panel médico</Link>
                            <Link className={`topbar-link ${isActive('/medico/vincular') ? 'active' : ''}`} to="/medico/vincular">Agregar paciente</Link>
                        </>
                    )}

                    {rol === 'admin' && (
                        <Link className={`topbar-link ${isActive('/admin/roles') ? 'active' : ''}`} to="/admin/roles">Roles y usuarios</Link>
                    )}

                    <Link className={`topbar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">Mi perfil</Link>
                    <div style={{ margin: '20px 0' }}>
                        <Link to="/perfil">
                            Editar mi perfil
                        </Link>
                    </div>
                    <button className="topbar-logout" onClick={handleLogout}>Cerrar sesión</button>
                </nav>
            </header>

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}


export default Layout