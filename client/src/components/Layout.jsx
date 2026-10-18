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
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <span className="dot"></span>
                    Turnos Salud
                </div>

                <Link className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">Mi perfil</Link>
                <Link className={`sidebar-link ${isActive('/mis-turnos') ? 'active' : ''}`} to="/mis-turnos">Mis turnos</Link>
                <Link className={`sidebar-link ${isActive('/reservar') ? 'active' : ''}`} to="/reservar">Reservar turno</Link>

                <div className="sidebar-footer">
                    <button
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout