import { useState } from "react"
import axios from 'axios'

function PagarConsulta({ turnoId }) {

    const [metodoPago, setMetodoPago] = useState("tarjeta_credito")
    const [comprobante, setComprobante] = useState(null)
    const [mensaje, setMensaje] = useState("")
    const token = localStorage.getItem('token')

    const pagar = async () => {
        setMensaje("")
        try {
            const response = await axios.post('http://localhost:3000/turnos/pagar',
                { turnoId, metodoPago },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setComprobante(response.data.comprobante)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al procesar el pago")
        }
    }

    return (
        <div>
            <h2>Pagar consulta</h2>

            <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option value="tarjeta_credito">Tarjeta de crédito</option>
                <option value="tarjeta_debito">Tarjeta de débito</option>
                <option value="billetera_virtual">Billetera virtual</option>
            </select>

            <button onClick={pagar}>Pagar</button>

            {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}

            {comprobante && (
                <div>
                    <h3>Comprobante</h3>
                    <p>Turno: {comprobante.turnoId}</p>
                    <p>Monto: ${comprobante.monto}</p>
                    <p>Token: {comprobante.token}</p>
                </div>
            )}
        </div>
    )
}

export default PagarConsulta