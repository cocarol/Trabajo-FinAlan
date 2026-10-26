import { Link, useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function Layout({ children }) {
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => location.pathname === path

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    
    const token = localStorage.getItem('token')
    
    let rol = null;
    let usuarioLogueado = null;
    
    if (token) {
        try {
            const decoded = jwtDecode(token);
            rol = decoded.role || 'paciente';
            
            if (decoded.email) {
                usuarioLogueado = decoded.email.split('@')[0];
            } else if (decoded.name) {
                usuarioLogueado = decoded.name;
            }
        } catch { 
        }
    }

    const esMedico = rol === 'medico'
    const esAdmin = rol === 'admin'
    const esPaciente = rol === 'paciente'

    return (
        <div className="app-layout">
            <header className="topbar">
                <Link to="/" className="topbar-brand">
                    <span className="cruz"></span>
                    Turnos Salud
                </Link>

                <nav className="topbar-nav">
                    {!token ? (
                        <div className="guest-buttons">
                            <Link to="/login" className="btn-secundario" style={{textDecoration: 'none'}}>Ingresar</Link>
                            <Link to="/register" className="btn-primario" style={{textDecoration: 'none'}}>Crear Cuenta</Link>
                        </div>
                    ) : (
                        <>
                            {esPaciente && (
                                <>
                                    <Link className={`topbar-link ${isActive('/reservar') ? 'active' : ''}`} to="/reservar">Reservar turno</Link>
                                    <Link className={`topbar-link ${isActive('/mis-turnos') ? 'active' : ''}`} to="/mis-turnos">Mis turnos</Link>
                                </>
                            )}

                            {esMedico && (
                                <>
                                    <Link className={`topbar-link ${isActive('/medico/panel') ? 'active' : ''}`} to="/medico/panel">Panel médico</Link>
                                    <Link className={`topbar-link ${isActive('/medico/vincular') ? 'active' : ''}`} to="/medico/vincular">Agregar paciente</Link>
                                </>
                            )}

                            {esAdmin && (
                                <>
                                    <Link className={`topbar-link ${isActive('/admin/roles') ? 'active' : ''}`} to="/admin/roles">Roles y usuarios</Link>
                                    <Link className={`topbar-link ${isActive('/admin/integridad') ? 'active' : ''}`} to="/admin/integridad">Integridad</Link>
                                </>
                            )}

                            <Link className={`topbar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">Mi perfil</Link>
                            
                            <div className="user-indicator-wrapper">
                                <span className="user-indicator">
                                    <div className="status-dot"></div>
                                    {usuarioLogueado}
                                </span>
                                <button className="topbar-logout" onClick={handleLogout}>Salir</button>
                            </div>
                        </>
                    )}
                </nav>
            </header>

            <main className="main-content">
                {children}
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <div>
                        © {new Date().getFullYear()} Turnos Salud. Todos los derechos reservados.
                    </div>
                    
                    <div className="footer-links">
                        <Link to="/contacto">Soporte Técnico</Link>
                        <Link to="/privacidad">Políticas de Privacidad</Link>
                        <Link to="/terminos">Términos de Uso</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout