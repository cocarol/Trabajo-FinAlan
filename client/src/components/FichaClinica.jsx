import { useState, useEffect } from "react"
import axios from 'axios'
import { useParams } from "react-router-dom"
import Layout from "./Layout"

function FichaClinica() {

    const { id_paciente } = useParams()
    const [fichas, setFichas] = useState([])
    const [peso, setPeso] = useState("")
    const [altura, setAltura] = useState("")
    const [presion, setPresion] = useState("")
    const [observaciones, setObservaciones] = useState("")
    const [mensaje, setMensaje] = useState("")

    const token = localStorage.getItem('token')

    const fetchFichas = async () => {
        const response = await axios.get(`http://localhost:3000/medico/ficha-clinica/${id_paciente}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setFichas(response.data)
    }

    const guardarFicha = async () => {
        setMensaje("")
        try {
            const response = await axios.post('http://localhost:3000/medico/ficha-clinica',
                { id_paciente, peso, altura, presion, observaciones },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            setPeso(""); setAltura(""); setPresion(""); setObservaciones("")
            fetchFichas()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al guardar la ficha")
        }
    }

    useEffect(() => {
        fetchFichas()
    }, [])

    return (
        <Layout>
            <h1>Ficha clínica</h1>

            <div className="form-card" style={{ marginBottom: '24px' }}>
                <h3>Nueva actualización</h3>
                {mensaje && <div className="mensaje-info">{mensaje}</div>}

                <div className="form-field">
                    <label>Peso (kg)</label>
                    <input type="text" value={peso} onChange={(e) => setPeso(e.target.value)} />
                </div>
                <div className="form-field">
                    <label>Altura (cm)</label>
                    <input type="text" value={altura} onChange={(e) => setAltura(e.target.value)} />
                </div>
                <div className="form-field">
                    <label>Presión arterial</label>
                    <input type="text" value={presion} onChange={(e) => setPresion(e.target.value)} />
                </div>
                <div className="form-field">
                    <label>Observaciones</label>
                    <input type="text" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                </div>

                <button className="btn-primario" onClick={guardarFicha} style={{ width: '100%' }}>
                    Guardar Ficha Clínica
                </button>
            </div>

            <h3>Historial</h3>
            {fichas.map(f => (
                <div key={f.id} className="turno-card estado-pagado">
                    <div className="turno-info">
                        <div className="especialidad">Peso: {f.peso} kg · Altura: {f.altura} cm</div>
                        <div className="detalle">Presión: {f.presion} — {f.observaciones}</div>
                    </div>
                </div>
            ))}
        </Layout>
    )
}

export default FichaClinica