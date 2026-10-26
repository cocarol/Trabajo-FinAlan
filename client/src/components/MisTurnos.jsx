import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function MisTurnos() {

    const [turnos, setTurnos] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [turnoAPagar, setTurnoAPagar] = useState(null)
    const [metodoPago, setMetodoPago] = useState("tarjeta_credito")
    const [comprobante, setComprobante] = useState(null)

    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        try {
            const decoded = jwtDecode(token)
            if (decoded.role !== 'paciente') {
                navigate('/')
                return
            }
        } catch (error) {
            navigate('/login')
            return
        }
        fetchTurnos()
    }, [])

    const fetchTurnos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/turnos/mis-turnos', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTurnos(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const cancelarTurno = async (turnoId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/turnos/${turnoId}/cancelar`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMensaje(response.data.message)
            cerrarPanelPago()
            fetchTurnos()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al cancelar el turno")
        }
    }

    const abrirPago = (turnoId) => {
        setMensaje("")
        setComprobante(null)
        setTurnoAPagar(turnoId)
    }

    const cerrarPanelPago = () => {
        setTurnoAPagar(null)
        setComprobante(null)
        setMensaje("")
    }

    const confirmarPago = async () => {
        try {
            const response = await axios.post('http://localhost:3000/turnos/pagar',
                { turnoId: turnoAPagar, metodoPago },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setComprobante(response.data.comprobante)
            fetchTurnos()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al procesar el pago")
        }
    }

    return (
        <Layout>
            <h1>Mis turnos</h1>
            {mensaje && <div className="mensaje-info">{mensaje}</div>}

            {turnos.length === 0 && (
                <p className="texto-vacio">Todavía no tenés turnos reservados.</p>
            )}

            {turnos.map(turno => (
                <div key={turno.id}>
                    <div className={`turno-card estado-${turno.estado.toLowerCase()}`}>
                        <div className="turno-info">
                            <div className="especialidad">{turno.especialidad}</div>
                            <div className="detalle">{turno.fecha} · {turno.horario} · {turno.ubicacion}</div>
                        </div>
                        <div className="turno-acciones">
                            <span className={`badge-estado ${turno.estado.toLowerCase()}`}>{turno.estado}</span>

                            {turno.estado === "Reservado" && (
                                <button className="btn-pagar" onClick={() => abrirPago(turno.id)}>Pagar</button>
                            )}

                            {(turno.estado === "Reservado" || turno.estado === "Pagado") && (
                                <button className="btn-peligro" onClick={() => cancelarTurno(turno.id)}>Cancelar</button>
                            )}
                        </div>
                    </div>

                    {turnoAPagar === turno.id && (
                        <div className="form-card panel-pago-inline">
                            <h3>{comprobante ? "Pago exitoso" : "Pagar consulta"}</h3>

                            {!comprobante ? (
                                <>
                                    <div className="form-field">
                                        <label>Método de pago</label>
                                        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                                            <option value="tarjeta_credito">Tarjeta de crédito</option>
                                            <option value="tarjeta_debito">Tarjeta de débito</option>
                                            <option value="billetera_virtual">Billetera virtual</option>
                                        </select>
                                    </div>

                                    <button className="btn-primario btn-block" onClick={confirmarPago}>
                                        Confirmar pago
                                    </button>
                                </>
                            ) : (
                                <div className="comprobante">
                                    <p className="comprobante-titulo">Pago aprobado</p>
                                    <div className="monto">${comprobante.monto}</div>
                                    <p className="comprobante-token">
                                        Comprobante: {comprobante.token}
                                    </p>
                                </div>
                            )}

                            <button className="btn-secundario btn-cerrar-panel" onClick={cerrarPanelPago}>
                                Cerrar panel
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </Layout>
    )
}

export default MisTurnos