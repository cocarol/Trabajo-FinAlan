import { useState } from 'react';
import axios from 'axios';

export default function AuditoriaAdmin() {
    const [resultado, setResultado] = useState(null);
    const [errores, setErrores] = useState([]);
    const token = localStorage.getItem('token');

    const verificarIntegridad = async () => {
        try {
            const response = await axios.get('http://localhost:3000/integridad', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResultado(response.data.message);
            setErrores([]);
        } catch (error) {
            if (error.response?.status === 409) {
                setResultado("Se detectaron registros alterados.");
                setErrores(error.response.data.errores);
            } else {
                setResultado("Error al conectar con el servidor.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid red', borderRadius: '8px', marginTop: '20px' }}>
            <h2>Motor de Integridad (CU15)</h2>
            <button className="btn-primario" onClick={verificarIntegridad}>Escanear Base de Datos</button>
            
            {resultado && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{resultado}</p>}
            
            {errores.length > 0 && (
                <ul style={{ color: 'red' }}>
                    {errores.map((err, idx) => (
                        <li key={idx}>Tabla: {err.tabla} | ID Registro: {err.id} | Falla: {err.error}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}