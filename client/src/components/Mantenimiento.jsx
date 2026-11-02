import { useState, useEffect } from "react"
import axios from 'axios'
import Layout from "./Layout"

function Mantenimiento() {

    const [copias, setCopias] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [exito, setExito] = useState(false)
    const [trabajando, setTrabajando] = useState(false)
    const [backupPrevio, setBackupPrevio] = useState(true)
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const fetchCopias = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/backups', { headers })
            setCopias(response.data)
        } catch (error) {
            setCopias([])   // 404: todavía no hay copias
        }
    }

    const generarBackup = async () => {
        setMensaje("")
        setTrabajando(true)
        try {
            const response = await axios.post('http://localhost:3000/admin/backup', {}, { headers })
            setMensaje(`${response.data.message} Checksum: ${response.data.backup.checksum.substring(0, 16)}...`)
            setExito(true)
            fetchCopias()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al generar el backup")
            setExito(false)
        } finally {
            setTrabajando(false)
        }
    }

    const restaurar = async (archivo) => {
        const confirmado = window.confirm("Esto reemplaza TODOS los datos actuales por los de la copia seleccionada. ¿Continuar?")
        if (!confirmado) return

        setMensaje("")
        setTrabajando(true)
        try {
            const response = await axios.post('http://localhost:3000/admin/restore', { archivo, backupPrevio }, { headers })
            setMensaje(response.data.message)
            setExito(true)
            fetchCopias()
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al restaurar la copia")
            setExito(false)
        } finally {
            setTrabajando(false)
        }
    }

    useEffect(() => {
        fetchCopias()
    }, [])

    return (
        <Layout>
            <h1>Mantenimiento</h1>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '20px' }}>
                Copias de seguridad y restauración de la base de datos
            </p>

            {mensaje && <div className={exito ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

            <div className="form-card" style={{ maxWidth: '100%', marginBottom: '24px' }}>
                <h3>Nueva copia de seguridad</h3>
                <p style={{ color: 'var(--tinta-suave)' }}>
                    Empaqueta usuarios, turnos, fichas e historial, los cifra y los guarda en el almacenamiento externo.
                </p>
                <button className="btn-primario" onClick={generarBackup} disabled={trabajando}>
                    {trabajando ? "Procesando..." : "Generar backup"}
                </button>
            </div>

            <h3>Copias disponibles</h3>

            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '8px 0 16px', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={backupPrevio} onChange={(e) => setBackupPrevio(e.target.checked)} />
                Hacer un backup del estado actual antes de restaurar
            </label>

            {copias.length === 0 && (
                <p style={{ color: 'var(--tinta-suave)' }}>No hay copias de seguridad disponibles.</p>
            )}

            {copias.map(copia => (
                <div key={copia.archivo} className="turno-card estado-pagado">
                    <div className="turno-info">
                        <div className="especialidad">{new Date(copia.fecha).toLocaleString()}</div>
                        <div className="detalle">
                            {(copia.tamano / 1024).toFixed(1)} KB · {copia.registros.users} usuarios · {copia.registros.turnos} turnos · checksum {copia.checksum.substring(0, 12)}...
                        </div>
                    </div>
                    <button className="btn-peligro" onClick={() => restaurar(copia.archivo)} disabled={trabajando}>
                        Restaurar
                    </button>
                </div>
            ))}
        </Layout>
    )
}

export default Mantenimiento