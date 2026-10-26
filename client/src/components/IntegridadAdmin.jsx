import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "./Layout"

export default function IntegridadAdmin() {
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
                setErrores([]);
            }
        }
    };

    useEffect(() => {
        verificarIntegridad()
    }, [])

    return (
        <div className="panel-integridad">
            <h2>Motor de Integridad (CU15)</h2>
            <button className="btn-primario" onClick={verificarIntegridad}>
                Escanear Base de Datos
            </button>
            
            {resultado && (
                <p className={`resultado-integridad ${errores.length > 0 ? 'resultado-peligro' : 'resultado-exito'}`}>
                    {resultado}
                </p>
            )}
            
            {errores.length > 0 && (
                <ul className="lista-errores">
                    {errores.map((err, idx) => (
                        <li key={idx}>
                            <strong>Tabla:</strong> {err.tabla} | <strong>ID Registro:</strong> {err.id} | <strong>Falla:</strong> {err.error}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}