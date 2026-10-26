import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"

function GestionRoles() {

    const [usuarios, setUsuarios] = useState([])
    const [seleccion, setSeleccion] = useState({})
    const [busqueda, setBusqueda] = useState("")
    const [mensaje, setMensaje] = useState("")
    const token = localStorage.getItem('token')

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsuarios(response.data)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al cargar los usuarios")
        }
    }

    const guardarRol = async (usuario) => {
        const nuevoRol = seleccion[usuario.id_usuario] || usuario.role
        setMensaje("")

        try {
            const response = await axios.put(`http://localhost:3000/admin/usuarios/${usuario.id_usuario}/rol`,
                { nuevoRol },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMensaje(response.data.message)
            fetchUsuarios()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al cambiar el rol")
        }
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const filtrados = usuarios.filter(u =>
        u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <Layout>
            <h1>Gestión de roles y usuarios</h1>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '20px' }}>
                Asigná o revocá el nivel de acceso de cada cuenta
            </p>

            {mensaje && <div className={mensaje.startsWith("Rol actualizado") ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

            <div className="form-field" style={{ maxWidth: '360px' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o email"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {filtrados.map(u => (
                <div key={u.id_usuario} className="turno-card estado-pagado">
                    <div className="turno-info">
                        <div className="especialidad">{u.name}</div>
                        <div className="detalle">{u.email} · Rol actual: <span className="badge-estado disponible">{u.role}</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                            value={seleccion[u.id_usuario] || u.role}
                            onChange={(e) => setSeleccion({ ...seleccion, [u.id_usuario]: e.target.value })}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--borde)' }}
                        >
                            <option value="paciente">Paciente</option>
                            <option value="medico">Médico</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <button className="btn-primario" onClick={() => guardarRol(u)}>Guardar cambios</button>
                    </div>
                </div>
            ))}
        </Layout>
    )
}

export default GestionRoles