import { useState } from "react"
import axios from 'axios'
import Layout from "./Layout"

function BuscarYReservarTurno() {

    const [especialidad, setEspecialidad] = useState("")
    const [fecha, setFecha] = useState("")
    const [turnosDisponibles, setTurnosDisponibles] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [buscado, setBuscado] = useState(false)

    const token = localStorage.getItem('token')

    const buscarTurnos = async () => {
        setMensaje("")
        setBuscado(true)
        try {
            const response = await axios.get('http://localhost:3000/turnos/disponibles', {
                params: { especialidad, fecha },
                headers: { Authorization: `Bearer ${token}` }
            })
            setTurnosDisponibles(response.data)
        } catch (error) {
            setMensaje(error.response?.data?.message || "No se encontraron turnos disponibles")
            setTurnosDisponibles([])
        }
    }

    const reservar = async (turnoId) => {
        try {
            const response = await axios.post('http://localhost:3000/turnos/reservar',
                { turnoId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje("Turno reservado con éxito. Lo vas a encontrar en 'Mis turnos' para completar el pago.")
            setTurnosDisponibles(turnosDisponibles.filter(t => t.id !== turnoId))
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al reservar el turno")
        }
    }

    return (
        <Layout>
            <h1>Reservar turno</h1>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '24px' }}>
                Buscá por especialidad y fecha para ver la disponibilidad
            </p>

            <div className="form-card" style={{ maxWidth: '600px', display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div className="form-field" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Especialidad</label>
                    <input type="text" placeholder="Ej: Cardiología" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
                </div>
                <div className="form-field" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <button className="btn-primario" onClick={buscarTurnos}>Buscar</button>
            </div>

            {mensaje && <div className={mensaje.includes("éxito") ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

            {buscado && turnosDisponibles.length === 0 && !mensaje && (
                <p style={{ color: 'var(--tinta-suave)' }}>No hay turnos disponibles para esos criterios.</p>
            )}

            {turnosDisponibles.map(turno => (
                <div key={turno.id} className="turno-card estado-disponible">
                    <div className="turno-info">
                        <div className="especialidad">{turno.especialidad}</div>
                        <div className="detalle">{turno.fecha} · {turno.horario} · {turno.ubicacion}</div>
                    </div>
                    <button className="btn-primario" onClick={() => reservar(turno.id)}>Reservar</button>
                </div>
            ))}
        </Layout>
    )
}

export default BuscarYReservarTurno