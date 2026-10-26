import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function EliminarCuenta() {

    const [confirmando, setConfirmando] = useState(false)
    const [password, setPassword] = useState("")
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const eliminar = async () => {
        setMensaje("")
        try {
            await axios.delete('http://localhost:3000/users/me', {
                headers: { Authorization: `Bearer ${token}` },
                data: { password }
            })
            localStorage.removeItem('token')
            navigate('/register')
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al eliminar la cuenta")
        }
    }

    return (
        <div className="zona-peligro">
            <h3>Eliminar cuenta</h3>
            <p style={{ color: 'var(--tinta-suave)' }}>
                Esta acción es permanente: se borra tu cuenta y tus turnos sin pagar vuelven a quedar disponibles.
            </p>

            {!confirmando && (
                <button className="btn-peligro" onClick={() => setConfirmando(true)}>Eliminar mi cuenta</button>
            )}

            {confirmando && (
                <>
                    {mensaje && <div className="mensaje-error">{mensaje}</div>}

                    <div className="form-field">
                        <label>Ingresá tu contraseña para confirmar</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-peligro" onClick={eliminar}>Confirmar eliminación</button>
                        <button className="btn-secundario" onClick={() => { setConfirmando(false); setPassword(""); setMensaje("") }}>Cancelar</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default EliminarCuenta