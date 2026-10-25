import { useState, useEffect } from "react"
import axios from 'axios'
import { Link } from "react-router-dom"
import Layout from "./Layout"

function PanelMedico() {

    const [pacientes, setPacientes] = useState([])
    const [mensaje, setMensaje] = useState("")
    const token = localStorage.getItem('token')

    const fetchPacientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/medico/pacientes-del-dia', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPacientes(response.data)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al cargar la lista")
            setPacientes([])
        }
    }

    useEffect(() => {
        fetchPacientes()
    }, [])

    return (
        <Layout>
            <h1>Panel médico</h1>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '20px' }}>Pacientes con turno confirmado para hoy</p>

            {mensaje && <p style={{ color: 'var(--tinta-suave)' }}>{mensaje}</p>}

            {pacientes.map(p => (
                <div key={p.turnoId} className="turno-card estado-pagado">
                    <div className="turno-info">
                        <div className="especialidad">{p.nombre}</div>
                        <div className="detalle">{p.horario} · {p.especialidad}</div>
                    </div>
                    <Link to={`/medico/ficha/${p.id_paciente}`} className="btn-secundario" style={{ textDecoration: 'none' }}>
                        Ver ficha
                    </Link>
                </div>
            ))}
        </Layout>
    )
}

export default PanelMedico
