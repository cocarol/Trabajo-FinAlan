import { useState } from "react"
import axios from 'axios'

function CambiarPassword() {

    const [passwordActual, setPasswordActual] = useState("")
    const [passwordNueva, setPasswordNueva] = useState("")
    const [confirmacion, setConfirmacion] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [exito, setExito] = useState(false)
    const token = localStorage.getItem('token')

    const guardar = async () => {
        setMensaje("")
        setExito(false)

        if (passwordNueva !== confirmacion) {
            setMensaje("La confirmación no coincide con la contraseña nueva.")
            return
        }

        try {
            const response = await axios.put('http://localhost:3000/users/cambiar-password',
                { passwordActual, passwordNueva },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            setExito(true)
            setPasswordActual("")
            setPasswordNueva("")
            setConfirmacion("")
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al cambiar la contraseña")
        }
    }

    return (
        <div className="form-card">
            <h2>Seguridad y contraseña</h2>

            {mensaje && <div className={exito ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

            <div className="form-field">
                <label>Contraseña actual</label>
                <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} />
            </div>
            <div className="form-field">
                <label>Contraseña nueva (mínimo 8 caracteres)</label>
                <input type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} />
            </div>
            <div className="form-field">
                <label>Repetir contraseña nueva</label>
                <input type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
            </div>

            <button className="btn-primario" onClick={guardar} style={{ width: '100%' }}>
                Guardar contraseña
            </button>
        </div>
    )
}

export default CambiarPassword