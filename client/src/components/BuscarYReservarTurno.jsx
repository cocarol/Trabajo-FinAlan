import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"

function BuscarYReservarTurno() {

    const [especialidad, setEspecialidad] = useState("")
    const [fecha, setFecha] = useState("")
    const [turnosDisponibles, setTurnosDisponibles] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [buscado, setBuscado] = useState(false)

    const token = localStorage.getItem('token')

    // Agregamos un useEffect para cargar los turnos por defecto al abrir la página
    useEffect(() => {
        cargarTurnosIniciales()
    }, [])

    const cargarTurnosIniciales = async () => {
        try {
            // Mandamos los params vacíos para traer todos los disponibles
            const response = await axios.get('http://localhost:3000/turnos/disponibles', {
                params: { especialidad: "", fecha: "" },
                headers: { Authorization: `Bearer ${token}` }
            })
            setTurnosDisponibles(response.data)
        } catch (error) {
            console.error("Error al cargar turnos iniciales:", error)
            // No seteamos mensaje de error invasivo acá para no asustar al usuario al entrar
        }
    }

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

    // Funcionalidad extra: Limpiar filtros y volver a mostrar todos
    const limpiarFiltros = () => {
        setEspecialidad("")
        setFecha("")
        setMensaje("")
        setBuscado(false)
        cargarTurnosIniciales()
    }

    return (
        <Layout>
            <h1>Reservar turno</h1>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '24px' }}>
                Buscá por especialidad y fecha para ver la disponibilidad
            </p>

            <div className="form-card" style={{ maxWidth: '700px', display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="form-field" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                    <label>Especialidad</label>
                    <input type="text" placeholder="Ej: Cardiología" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
                </div>
                <div className="form-field" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <button className="btn-primario" onClick={buscarTurnos}>Buscar</button>
                
                {/* Mostramos el botón de limpiar solo si hay filtros aplicados o se hizo una búsqueda */}
                {(especialidad || fecha || buscado) && (
                    <button className="btn-secundario" onClick={limpiarFiltros} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ccc' }}>
                        Limpiar filtros
                    </button>
                )}
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