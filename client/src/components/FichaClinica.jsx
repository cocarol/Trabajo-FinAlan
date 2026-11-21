import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from 'axios'
import Layout from "./Layout"

function FichaClinica() {
    const { id_paciente } = useParams()
    const [fichas, setFichas] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [error, setError] = useState("")
    
    const [formData, setFormData] = useState({
        peso: '', altura: '', presion: '', observaciones: ''
    })

    const token = localStorage.getItem('token')

    const fetchHistorial = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/medico/ficha-clinica/${id_paciente}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setFichas(response.data)
        } catch (err) {
            setError("No se pudo cargar el historial del paciente.")
        }
    }

    useEffect(() => {
        fetchHistorial()
    }, [id_paciente])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensaje("")
        setError("")

        try {
            const response = await axios.post('http://localhost:3000/medico/ficha-clinica', 
                { id_paciente, ...formData },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            setFormData({ peso: '', altura: '', presion: '', observaciones: '' })
            fetchHistorial()
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar la ficha")
        }
    }

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Ficha Clínica</h1>
                <Link to="/medico/panel" className="btn-secundario" style={{ textDecoration: 'none' }}>Volver al panel</Link>
            </div>

            <div className="perfil-layout">
                <section className="perfil-sidebar" style={{ minWidth: '300px' }}>
                    <form onSubmit={handleSubmit} className="form-card">
                        <h3>Nueva Evolución</h3>
                        {mensaje && <div className="mensaje-info">{mensaje}</div>}
                        {error && <div className="mensaje-error">{error}</div>}

                        <div className="form-field">
                            <label>Peso (kg)</label>
                            <input type="text" name="peso" value={formData.peso} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label>Altura (m)</label>
                            <input type="text" name="altura" value={formData.altura} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label>Presión Arterial</label>
                            <input type="text" name="presion" value={formData.presion} onChange={handleChange} required placeholder="Ej: 120/80" />
                        </div>
                        <div className="form-field">
                            <label>Observaciones / Diagnóstico</label>
                            <textarea 
                                name="observaciones" 
                                value={formData.observaciones} 
                                onChange={handleChange} 
                                required 
                                rows="4" 
                                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--borde)' }}
                            />
                        </div>
                        <button type="submit" className="btn-primario" style={{ width: '100%' }}>Guardar Ficha</button>
                    </form>
                </section>

                <section className="perfil-content">
                    <h3>Historial de Evoluciones</h3>
                    {fichas.length === 0 ? (
                        <p className="texto-vacio">El paciente no tiene registros clínicos previos.</p>
                    ) : (
                        fichas.map(ficha => (
                            <div key={ficha.id} className="perfil-detalle-card" style={{ marginBottom: '16px' }}>
                                <div className="perfil-dato-fila">
                                    <span className="perfil-dato-label">Evolución N° {ficha.id}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                    <div><strong>Peso:</strong> {ficha.peso}</div>
                                    <div><strong>Altura:</strong> {ficha.altura}</div>
                                    <div><strong>Presión:</strong> {ficha.presion}</div>
                                </div>
                                <div style={{ background: 'var(--fondo)', padding: '12px', borderRadius: '6px' }}>
                                    <strong>Observaciones:</strong> <br/>
                                    {ficha.observaciones}
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </Layout>
    )
}

export default FichaClinica