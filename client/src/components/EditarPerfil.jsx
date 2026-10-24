import { useState, useEffect } from 'react';
import axios from 'axios';

function EditarPerfil() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dni: '',
        especialidad: '',
        matricula: '',
        obra_social: '',
        numero_afiliado: '',
        telefono: ''
    });
    const [role, setRole] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/users/profile', {
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
                setError('No se pudo cargar la información del perfil.');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3000/users/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje('¡Perfil actualizado con éxito!');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar el perfil');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Mi Perfil</h2>

            {mensaje && <div style={{ color: 'green', marginBottom: '10px' }}>{mensaje}</div>}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <h3>Datos Generales</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nombre:</label><br />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>DNI:</label><br />
                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} style={{ width: '100%' }} />
                </div>

                {role === 'medico' && (
                    <>
                        <h3>Información Profesional</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Especialidad:</label><br />
                            <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Matrícula:</label><br />
                            <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                    </>
                )}

                {role === 'paciente' && (
                    <>
                        <h3>Información Médica / Contacto</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Obra Social:</label><br />
                            <input type="text" name="obra_social" value={formData.obra_social} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Número de Afiliado:</label><br />
                            <input type="text" name="numero_afiliado" value={formData.numero_afiliado} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Teléfono:</label><br />
                            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                    </>
                )}

                <button type="submit" style={{ width: '100%', padding: '10px', background: 'var(--verde-clinico)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}

export default EditarPerfil;