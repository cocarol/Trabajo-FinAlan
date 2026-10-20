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
    let esMedico = false
    try {
        esMedico = jwtDecode(token)?.role === 'medico'
    } catch { }

    return (
        <div className="app-layout">
            <header className="topbar">
                <Link to="/mis-turnos" className="topbar-brand">
                    <span className="cruz"></span>
                    Turnos Salud
                </Link>

                <nav className="topbar-nav">
                    <Link className={`topbar-link ${isActive('/mis-turnos') ? 'active' : ''}`} to="/mis-turnos">Mis turnos</Link>
                    {!esMedico && (
                        <Link className="topbar-link" to="/reservar">Reservar turno</Link>
                    )}
                    <Link className={`topbar-link ${isActive('/crear-turno') ? 'active' : ''}`} to="/crear-turno">Cargar turno</Link>
                    <Link className={`topbar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">Mi perfil</Link>
                    <div style={{ margin: '20px 0' }}>
                        <Link to="/perfil">
                            Editar mi perfil
                        </Link>
                    </div>
                    <button className="topbar-logout" onClick={handleLogout}>Cerrar sesión</button>
                    {esMedico && (
                        <>
                            <Link className={`topbar-link ${isActive('/medico/panel') ? 'active' : ''}`} to="/medico/panel">Panel médico</Link>
                            <Link className={`topbar-link ${isActive('/medico/vincular') ? 'active' : ''}`} to="/medico/vincular">Agregar paciente</Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout