import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import CambiarPassword from './CambiarPassword';
import EliminarCuenta from './EliminarCuenta';

function Perfil() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [pestanaActiva, setPestanaActiva] = useState('info');
    
    const [formData, setFormData] = useState({
        name: '', email: '', dni: '',
        especialidad: '', matricula: '',
        obra_social: '', numero_afiliado: '', telefono: ''
    });

    const token = localStorage.getItem('token');

    const fetchPerfil = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const u = response.data;
            setRole(u.role);
            setFormData({
                name: u.name || '',
                email: u.email || '',
                dni: u.dni || '',
                especialidad: u.Medico?.especialidad || '',
                matricula: u.Medico?.matricula || '',
                obra_social: u.Paciente?.obra_social || '',
                numero_afiliado: u.Paciente?.numero_afiliado || '',
                telefono: u.Paciente?.telefono || ''
            });
        } catch (err) {
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) navigate('/login');
        else fetchPerfil();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(''); setError('');

        try {
            await axios.put('http://localhost:3000/users/perfil', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje('Perfil actualizado con éxito');
            setEditando(false);
            fetchPerfil();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar el perfil');
        }
    };

    if (loading) return <Layout><p>Cargando perfil...</p></Layout>;

    return (
        <Layout>
            <div className="perfil-layout">
                
                <aside className="perfil-sidebar">
                    <button className={`perfil-nav-item ${pestanaActiva === 'info' ? 'active' : ''}`} onClick={() => setPestanaActiva('info')}>
                        Info personal
                    </button>
                    {role === 'paciente' && (
                        <button className="perfil-nav-item" onClick={() => navigate('/mis-turnos')}>
                            Historial / Visitas
                        </button>
                    )}
                    <button className={`perfil-nav-item ${pestanaActiva === 'cuenta' ? 'active' : ''}`} onClick={() => setPestanaActiva('cuenta')}>
                        Configurar Cuenta
                    </button>
                    <button className={`perfil-nav-item ${pestanaActiva === 'seguridad' ? 'active' : ''}`} onClick={() => setPestanaActiva('seguridad')}>
                        Seguridad y Contraseña
                    </button>
                </aside>

                <section className="perfil-content">

                    {pestanaActiva === 'info' && (
                        <>
                            {mensaje && <div className="mensaje-info">{mensaje}</div>}
                            {error && <div className="mensaje-error">{error}</div>}

                            {!editando ? (
                                <>
                                    <div className="perfil-header-card">
                                        <div className="perfil-avatar">
                                            <svg className="perfil-avatar-svg" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        </div>
                                        <div className="perfil-info-principal">
                                            <h2>{formData.name}</h2>
                                            <span className="perfil-rol-badge">{role}</span>
                                        </div>
                                        <div className="perfil-info-extra">
                                            <p><strong>Email:</strong> {formData.email}</p>
                                            {formData.telefono && <p><strong>Tel:</strong> {formData.telefono}</p>}
                                        </div>
                                    </div>

                                    <div className="perfil-grid">
                                        <div className="perfil-detalle-card">
                                            <h3>Datos Personales <button className="btn-secundario" onClick={() => setEditando(true)}>Editar</button></h3>
                                            <div className="perfil-dato-fila">
                                                <span className="perfil-dato-label">Nombre Completo</span>
                                                <span className="perfil-dato-valor">{formData.name}</span>
                                            </div>
                                            <div className="perfil-dato-fila">
                                                <span className="perfil-dato-label">DNI</span>
                                                <span className="perfil-dato-valor">{formData.dni || 'No registrado'}</span>
                                            </div>
                                        </div>

                                        <div className="perfil-detalle-card">
                                            <h3>{role === 'medico' ? 'Datos Profesionales' : 'Cobertura Médica'}</h3>
                                            
                                            {role === 'medico' ? (
                                                <>
                                                    <div className="perfil-dato-fila">
                                                        <span className="perfil-dato-label">Especialidad</span>
                                                        <span className="perfil-dato-valor">{formData.especialidad || '-'}</span>
                                                    </div>
                                                    <div className="perfil-dato-fila">
                                                        <span className="perfil-dato-label">Matrícula</span>
                                                        <span className="perfil-dato-valor">{formData.matricula || '-'}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="perfil-dato-fila">
                                                        <span className="perfil-dato-label">Obra Social</span>
                                                        <span className="perfil-dato-valor">{formData.obra_social || 'Particular'}</span>
                                                    </div>
                                                    <div className="perfil-dato-fila">
                                                        <span className="perfil-dato-label">N° Afiliado</span>
                                                        <span className="perfil-dato-valor">{formData.numero_afiliado || '-'}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h2 style={{ margin: 0 }}>Editar Perfil</h2>
                                        <button type="button" className="btn-peligro" onClick={() => setEditando(false)}>Cancelar</button>
                                    </div>

                                    <div className="perfil-grid">
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Datos Generales</h3>
                                            <div className="form-field">
                                                <label>Nombre Completo</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                            </div>
                                            <div className="form-field">
                                                <label>Email</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                            <div className="form-field">
                                                <label>DNI</label>
                                                <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Información Adicional</h3>
                                            {role === 'medico' ? (
                                                <>
                                                    <div className="form-field">
                                                        <label>Especialidad</label>
                                                        <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} />
                                                    </div>
                                                    <div className="form-field">
                                                        <label>Matrícula</label>
                                                        <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="form-field">
                                                        <label>Obra Social</label>
                                                        <input type="text" name="obra_social" value={formData.obra_social} onChange={handleChange} />
                                                    </div>
                                                    <div className="form-field">
                                                        <label>Número de Afiliado</label>
                                                        <input type="text" name="numero_afiliado" value={formData.numero_afiliado} onChange={handleChange} />
                                                    </div>
                                                    <div className="form-field">
                                                        <label>Teléfono</label>
                                                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '24px', textAlign: 'right' }}>
                                        <button type="submit" className="btn-primario" style={{ padding: '12px 32px' }}>Guardar Cambios</button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}

                    {pestanaActiva === 'seguridad' && <CambiarPassword />}

                    {pestanaActiva === 'cuenta' && (
                        <>
                            <h2>Configurar cuenta</h2>
                            <EliminarCuenta />
                        </>
                    )}

                </section>
            </div>
        </Layout>
    );
}

export default Perfil;