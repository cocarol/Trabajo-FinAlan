import { useState } from "react"
import axios from 'axios'
import Layout from "./Layout"

function VincularPaciente() {

    const [dni, setDni] = useState("")
    const [mensaje, setMensaje] = useState("")
    const token = localStorage.getItem('token')

    const vincular = async () => {
        setMensaje("")
        try {
            const response = await axios.post('http://localhost:3000/medico/vincular-paciente',
                { dni },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            setDni("")
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al vincular el paciente")
        }
    }

    return (
        <Layout>
            <h1>Agregar paciente a mi lista</h1>

            <div className="form-card">
                {mensaje && <div className={mensaje.includes("correctamente") ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

                <div className="form-field">
                    <label>DNI del paciente</label>
                    <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} />
                </div>

                <button className="btn-primario" onClick={vincular} style={{ width: '100%' }}>
                    Buscar y Vincular
                </button>
            </div>
        </Layout>
    )
}

export default VincularPaciente
