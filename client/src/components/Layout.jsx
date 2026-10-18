import { Link, useLocation, useNavigate } from "react-router-dom"

function Layout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="app-layout">
            <header className="topbar">
                <Link to="/mis-turnos" className="topbar-brand">
                    <span className="cruz"></span>
                    Turnos Salud
                </Link>

                <nav className="topbar-nav">
                    <Link className={`topbar-link ${isActive('/mis-turnos') ? 'active' : ''}`} to="/mis-turnos">Mis turnos</Link>
                    <Link className={`topbar-link ${isActive('/reservar') ? 'active' : ''}`} to="/reservar">Reservar turno</Link>
                    <Link className={`topbar-link ${isActive('/crear-turno') ? 'active' : ''}`} to="/crear-turno">Cargar turno</Link>
                    <Link className={`topbar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">Mi perfil</Link>
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