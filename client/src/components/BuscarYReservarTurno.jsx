import { useState } from "react"
import axios from 'axios'

function BuscarYReservarTurno() {

    const [especialidad, setEspecialidad] = useState("")
    const [fecha, setFecha] = useState("")
    const [turnosDisponibles, setTurnosDisponibles] = useState([])
    const [mensaje, setMensaje] = useState("")

    const token = localStorage.getItem('token')

    const buscarTurnos = async () => {
        setMensaje("")
        try {
            const response = await axios.get('http://localhost:3000/turnos/disponibles', {
                params: { especialidad, fecha },
                headers: { Authorization: `Bearer ${token}` }
            })
            setTurnosDisponibles(response.data)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al buscar turnos")
            setTurnosDisponibles([])
        }
    }

    const reservar = async (turnoId) => {
        try {
            const response = await axios.post('http://localhost:3000/turnos/reservar',
                { turnoId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            setTurnosDisponibles(turnosDisponibles.filter(t => t.id !== turnoId))
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al reservar")
        }
    }

    return (
        <div>
            <h2>Reservar turno</h2>

            <input type="text" placeholder="Especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            <button onClick={buscarTurnos}>Buscar</button>

            {mensaje && <p>{mensaje}</p>}

            <ul>
                {turnosDisponibles.map(turno => (
                    <li key={turno.id}>
                        {turno.fecha} - {turno.horario} - {turno.ubicacion}
                        <button onClick={() => reservar(turno.id)}>Reservar</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BuscarYReservarTurno