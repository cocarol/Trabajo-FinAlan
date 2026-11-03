import { useState } from "react"
import axios from 'axios'
import Layout from "./Layout"

function VincularPaciente() {
    const [dni, setDni] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensaje("")
        setError("")

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:3000/medico/vincular-paciente', 
                { dni },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            setDni("")
        } catch (err) {
            setError(err.response?.data?.message || "Error al vincular el paciente")
        }
    }

    return (
        <Layout>
            <div className="form-card" style={{ maxWidth: '500px', margin: '40px auto' }}>
                <h2>Vincular Paciente</h2>
                <p style={{ color: 'var(--tinta-suave)', marginBottom: '24px' }}>
                    Ingrese el DNI del paciente para agregarlo a su lista de atención médica.
                </p>

                {mensaje && <div className="mensaje-info">{mensaje}</div>}
                {error && <div className="mensaje-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>DNI del Paciente</label>
                        <input 
                            type="text" 
                            value={dni} 
                            onChange={(e) => setDni(e.target.value)} 
                            required 
                            placeholder="Ej: 12345678"
                        />
                    </div>
                    <button type="submit" className="btn-primario" style={{ width: '100%' }}>
                        Buscar y Vincular
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default VincularPaciente