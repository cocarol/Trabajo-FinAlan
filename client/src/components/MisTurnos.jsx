import { useState, useEffect } from "react"
import axios from 'axios'

function MisTurnos() {

    const [turnos, setTurnos] = useState([])
    const [mensaje, setMensaje] = useState("")
    const token = localStorage.getItem('token')

    const fetchTurnos = async () => {
        // Supone un endpoint GET /turnos/mis-turnos (CU11) ya existente
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
        <div>
            <h2>Mis turnos</h2>
            {mensaje && <p>{mensaje}</p>}
            <ul>
                {turnos.map(turno => (
                    <li key={turno.id}>
                        {turno.fecha} - {turno.horario} - Estado: {turno.estado}
                        {(turno.estado === "Reservado" || turno.estado === "Pagado") && (
                            <button onClick={() => cancelarTurno(turno.id)}>Cancelar</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MisTurnos