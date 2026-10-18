import { useState } from "react"
import axios from 'axios'
import Layout from "./Layout"

function CrearTurno() {

    const [especialidad, setEspecialidad] = useState("")
    const [fecha, setFecha] = useState("")
    const [horario, setHorario] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [mensaje, setMensaje] = useState("")

    const token = localStorage.getItem('token')

    const crearTurno = async () => {
        setMensaje("")
        try {
            await axios.post('http://localhost:3000/turnos/crear',
                { especialidad, fecha, horario, ubicacion },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje("Turno creado correctamente")
            setEspecialidad("")
            setFecha("")
            setHorario("")
            setUbicacion("")
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al crear el turno")
        }
    }

    return (
        <Layout>
            <h1>Cargar nuevo turno</h1>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '24px' }}>
                Agregá un turno disponible para que los pacientes puedan reservarlo
            </p>

            <div className="form-card">
                {mensaje && <div className={mensaje.includes("correctamente") ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

                <div className="form-field">
                    <label>Especialidad</label>
                    <input type="text" placeholder="Ej: Cardiología" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
                </div>

                <div className="form-field">
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>

                <div className="form-field">
                    <label>Horario</label>
                    <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
                </div>

                <div className="form-field">
                    <label>Ubicación</label>
                    <input type="text" placeholder="Ej: Consultorio 3" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
                </div>

                <button className="btn-primario" onClick={crearTurno} style={{ width: '100%' }}>
                    Cargar turno
                </button>
            </div>
        </Layout>
    )
}

export default CrearTurno