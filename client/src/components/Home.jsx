import { Link } from 'react-router-dom';
import Layout from './Layout';
import heroImg from '../assets/piri.jpg'; 

export default function Home() {
    const token = localStorage.getItem('token');

    return (
        <Layout>
            <div className="home-wrapper">
                
                <section className="hero-section">
                    <div className="hero-text">
                        <div className="eyebrow" style={{ marginBottom: '10px' }}>
                            BIENVENIDO A TURNOS SALUD
                        </div>
                        <h1>
                            Tu salud, <br />
                            <span>sin demoras.</span>
                        </h1>
                        <p className="hero-desc">
                            Gestioná tus turnos médicos de forma rápida y segura. Encontrá a los mejores especialistas cerca tuyo y olvidate de las salas de espera interminables.
                        </p>
                        
                        <div className="hero-buttons">
                            {token ? (
                                <Link to="/reservar" className="btn-link-primario">
                                    Reservar un turno ahora
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-link-primario">
                                        Ingresar a mi cuenta
                                    </Link>
                                    <Link to="/register" className="btn-link-secundario">
                                        Registrarme gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="hero-image">
                        <img src={heroImg} alt="Atención médica profesional" />
                    </div>
                </section>

                <section className="features-section">
                    <h2 className="features-title">Por qué elegirnos</h2>
                    
                    <div className="features-grid">
                        <div className="form-card feature-card">
                            <div className="feature-icon rapidez">⏱</div>
                            <h3>Gestión rápida</h3>
                            <p>Reservá, reprogramá o cancelá tus turnos en cuestión de segundos.</p>
                        </div>

                        <div className="form-card feature-card">
                            <div className="feature-icon seguridad">🛡</div>
                            <h3>Historial Seguro</h3>
                            <p>Toda tu información médica protegida y cifrada bajo los más altos estándares.</p>
                        </div>

                        <div className="form-card feature-card">
                            <div className="feature-icon pagos">💳</div>
                            <h3>Pagos Simples</h3>
                            <p>Aboná tus consultas directamente desde la web, sin filas en recepción.</p>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <h2>¿Listo para cuidar tu salud?</h2>
                    <p>Unite a los miles de pacientes que ya gestionan sus turnos con nosotros.</p>
                    
                    {!token && (
                        <Link to="/register" className="btn-cta">
                            Comenzar ahora
                        </Link>
                    )}
                </section>

            </div>
        </Layout>
    );
}