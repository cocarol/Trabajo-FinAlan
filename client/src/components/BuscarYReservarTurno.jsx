import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"

function BuscarYReservarTurno() {

    const [especialidad, setEspecialidad] = useState("")
    const [fecha, setFecha] = useState("")
    const [turnosDisponibles, setTurnosDisponibles] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [buscado, setBuscado] = useState(false)
    const [listaEspecialidades, setListaEspecialidades] = useState([])

    const token = localStorage.getItem('token')

    useEffect(() => {
        cargarTurnosIniciales()
        cargarEspecialidades()
    }, [])

    const cargarTurnosIniciales = async () => {
        try {
            const response = await axios.get('http://localhost:3000/turnos/disponibles', {
                params: { especialidad: "", fecha: "" },
                headers: { Authorization: `Bearer ${token}` }
            })
            setTurnosDisponibles(response.data)
        } catch (error) {
            console.error("Error al cargar turnos iniciales:", error)
        }
    }

    const cargarEspecialidades = async () => {
        try {
            const response = await axios.get('http://localhost:3000/catalogo/especialidades')
            setListaEspecialidades(response.data)
        } catch (error) {
            console.error("Error al cargar especialidades:", error)
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
            const tokenActual = localStorage.getItem('token')
            const response = await axios.post('http://localhost:3000/turnos/reservar',
                { turnoId },
                { headers: { Authorization: `Bearer ${tokenActual}` } }
            )
            setMensaje("Turno reservado con éxito. Lo vas a encontrar en 'Mis turnos' para completar el pago.")
            setTurnosDisponibles(turnosDisponibles.filter(t => t.id !== turnoId))
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al reservar el turno")
        }
    }

    const limpiarFiltros = () => {
        setEspecialidad("")
        setFecha("")
        setMensaje("")
        setBuscado(false)
        cargarTurnosIniciales()
        cargarEspecialidades()
    }

    return (
        <Layout>
            <h1>Reservar turno</h1>
            <p className="texto-descriptivo">
                Buscá por especialidad y fecha para ver la disponibilidad
            </p>

            <div className="form-card filtros-bar">
                <div className="form-field campo-especialidad">
                    <label>Especialidad</label>
                    <select
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                    >
                        <option value="">Todas las especialidades</option>
                        {listaEspecialidades.map((esp) => (
                            <option key={esp.id_especialidad} value={esp.nombre_especialidad}>
                                {esp.nombre_especialidad}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-field campo-fecha">
                    <label>Fecha</label>
                    <input 
                        type="date" 
                        value={fecha} 
                        onChange={(e) => setFecha(e.target.value)} 
                    />
                </div>

                <button className="btn-primario" onClick={buscarTurnos}>
                    Buscar
                </button>
                
                {(especialidad || fecha || buscado) && (
                    <button className="btn-primario" onClick={limpiarFiltros}>
                        Limpiar filtros
                    </button>
                )}
            </div>

            {mensaje && (
                <div className={mensaje.includes("éxito") ? "mensaje-info" : "mensaje-error"}>
                    {mensaje}
                </div>
            )}

            {buscado && turnosDisponibles.length === 0 && !mensaje && (
                <p className="texto-vacio">No hay turnos disponibles para esos criterios.</p>
            )}

            {turnosDisponibles.map(turno => (
                <div key={turno.id} className="turno-card estado-disponible">
                    <div className="turno-info">
                        <div className="especialidad">{turno.especialidad}</div>
                        <div className="detalle">{turno.fecha} · {turno.horario} · {turno.ubicacion}</div>
                    </div>
                    <button className="btn-primario" onClick={() => reservar(turno.id)}>
                        Reservar
                    </button>
                </div>
            ))}
        </Layout>
    )
}

export default BuscarYReservarTurno