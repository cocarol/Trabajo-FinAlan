import { useState } from "react"
import axios from 'axios'
import { Link } from "react-router-dom"

function RecuperarPassword() {

    const [email, setEmail] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [enlaceDemo, setEnlaceDemo] = useState("")

    const solicitar = async () => {
        setMensaje("")
        setEnlaceDemo("")
        try {
            const response = await axios.post('http://localhost:3000/users/recuperar', { email })
            setMensaje(response.data.message)
            if (response.data.enlaceDemo) setEnlaceDemo(response.data.enlaceDemo)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al solicitar la recuperación")
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-card">
                <h1>Recuperar contraseña</h1>
                <p style={{ color: 'var(--tinta-suave)', marginBottom: '20px' }}>
                    Ingresá tu correo y te enviamos un enlace para crear una nueva
                </p>

                {mensaje && <div className="mensaje-info">{mensaje}</div>}

                {enlaceDemo && (
                    <div className="mensaje-info">
                        Modo demo (sin servidor de correo): <a href={enlaceDemo}>abrir enlace de recuperación</a>
                    </div>
                )}

                <div className="form-field">
                    <label>Correo electrónico</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <button className="btn-primario" onClick={solicitar} style={{ width: '100%' }}>
                    Enviar enlace
                </button>

                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' }}>
                    <Link to="/login" style={{ color: 'var(--verde-clinico)', fontWeight: 600 }}>Volver al login</Link>
                </p>
            </div>
        </div>
    )
}

export default RecuperarPassword