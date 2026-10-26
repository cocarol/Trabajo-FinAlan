import { useState } from "react"
import axios from 'axios'
import { useParams, useNavigate, Link } from "react-router-dom"

function ResetPassword() {

    const { token } = useParams()
    const [passwordNueva, setPasswordNueva] = useState("")
    const [confirmacion, setConfirmacion] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [exito, setExito] = useState(false)
    const navigate = useNavigate()

    const restablecer = async () => {
        setMensaje("")

        if (passwordNueva !== confirmacion) {
            setMensaje("Las contraseñas no coinciden.")
            return
        }

        try {
            const response = await axios.post('http://localhost:3000/users/reset-password', { token, passwordNueva })
            setMensaje(response.data.message)
            setExito(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al restablecer la contraseña")
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="form-card">
                <h1>Nueva contraseña</h1>

                {mensaje && <div className={exito ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

                <div className="form-field">
                    <label>Contraseña nueva (mínimo 8 caracteres)</label>
                    <input type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} />
                </div>
                <div className="form-field">
                    <label>Repetir contraseña</label>
                    <input type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
                </div>

                <button className="btn-primario" onClick={restablecer} style={{ width: '100%' }}>
                    Restablecer contraseña
                </button>

                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' }}>
                    <Link to="/login" style={{ color: 'var(--verde-clinico)', fontWeight: 600 }}>Volver al login</Link>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword