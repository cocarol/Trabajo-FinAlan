import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"

function MisTurnos() {

    const [turnos, setTurnos] = useState([])
    const [mensaje, setMensaje] = useState("")
    const token = localStorage.getItem('token')

    const fetchTurnos = async () => {
        const response = await axios.get('http://localhost:3000/turnos/mis-turnos', {
            headers: { Authorization: `Bearer ${token}` }
        })
        setTurnos(response.data)
    }

    const cancelarTurno = async (turnoId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/turnos/${turnoId}/cancelar`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMensaje(response.data.message)
            fetchTurnos()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al cancelar el turno")
        }
    }

    useEffect(() => {
        fetchTurnos()
    }, [])

    return (
        <Layout>
            <h1>Mis turnos</h1>
            {mensaje && <div className="mensaje-info">{mensaje}</div>}

            {turnos.length === 0 && <p style={{ color: 'var(--tinta-suave)' }}>Todavía no tenés turnos reservados.</p>}

            {turnos.map(turno => (
                <div key={turno.id} className={`turno-card estado-${turno.estado.toLowerCase()}`}>
                    <div className="turno-info">
                        <div className="especialidad">{turno.especialidad}</div>
                        <div className="detalle">{turno.fecha} · {turno.horario} · {turno.ubicacion}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`badge-estado ${turno.estado.toLowerCase()}`}>{turno.estado}</span>
                        {(turno.estado === "Reservado" || turno.estado === "Pagado") && (
                            <button className="btn-peligro" onClick={() => cancelarTurno(turno.id)}>Cancelar</button>
                        )}
                    </div>
                </div>
            ))}
        </Layout>
    )
}

export default MisTurnos