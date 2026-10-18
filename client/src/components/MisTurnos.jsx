import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"

function MisTurnos() {

    const [turnos, setTurnos] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [turnoAPagar, setTurnoAPagar] = useState(null)
    const [metodoPago, setMetodoPago] = useState("tarjeta_credito")
    const [comprobante, setComprobante] = useState(null)

    const token = localStorage.getItem('token')

    const fetchTurnos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/turnos/mis-turnos', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTurnos(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const cancelarTurno = async (turnoId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/turnos/${turnoId}/cancelar`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMensaje(response.data.message)
            setComprobante(null)
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

    useEffect(() => {
        fetchTurnos()
    }, [])

    return (
        <Layout>
            <h1>Mis turnos</h1>
            {mensaje && <div className="mensaje-info">{mensaje}</div>}

            {turnos.length === 0 && (
                <p style={{ color: 'var(--tinta-suave)' }}>Todavía no tenés turnos reservados.</p>
            )}

            {turnos.map(turno => (
                <div key={turno.id}>
                    <div className={`turno-card estado-${turno.estado.toLowerCase()}`}>
                        <div className="turno-info">
                            <div className="especialidad">{turno.especialidad}</div>
                            <div className="detalle">{turno.fecha} · {turno.horario} · {turno.ubicacion}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className={`badge-estado ${turno.estado.toLowerCase()}`}>{turno.estado}</span>

                            {turno.estado === "Reservado" && (
                                <button className="btn-secundario" onClick={() => abrirPago(turno.id)}>Pagar</button>
                            )}

                            {(turno.estado === "Reservado" || turno.estado === "Pagado") && (
                                <button className="btn-peligro" onClick={() => cancelarTurno(turno.id)}>Cancelar</button>
                            )}
                        </div>
                    </div>

                    {turnoAPagar === turno.id && (
                        <div className="form-card" style={{ maxWidth: '400px', marginBottom: '16px', marginTop: '-4px' }}>
                            <h3>Pagar consulta</h3>

                            <div className="form-field">
                                <label>Método de pago</label>
                                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                                    <option value="tarjeta_credito">Tarjeta de crédito</option>
                                    <option value="tarjeta_debito">Tarjeta de débito</option>
                                    <option value="billetera_virtual">Billetera virtual</option>
                                </select>
                            </div>

                            <button className="btn-primario" onClick={confirmarPago} style={{ width: '100%' }}>
                                Confirmar pago
                            </button>

                            {comprobante && (
                                <div className="comprobante">
                                    <p style={{ margin: 0, color: 'var(--tinta-suave)', fontSize: '0.85rem' }}>Pago aprobado</p>
                                    <div className="monto">${comprobante.monto}</div>
                                    <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', color: 'var(--tinta-suave)' }}>
                                        Comprobante: {comprobante.token}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </Layout>
    )
}

export default MisTurnos