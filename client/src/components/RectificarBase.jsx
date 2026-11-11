import { useState } from "react"
import axios from 'axios'

const ETIQUETA = { reparar: 'Se corrige', eliminar: 'Se elimina', irreparable: 'Irreparable: revisión manual' }
const CLASE = { reparar: 'disponible', eliminar: 'reservado', irreparable: 'cancelado' }

function RectificarBase() {

    const [analisis, setAnalisis] = useState(null)
    const [resultado, setResultado] = useState(null)
    const [mensaje, setMensaje] = useState("")
    const [exito, setExito] = useState(false)
    const [trabajando, setTrabajando] = useState(false)
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const analizar = async () => {
        setMensaje("")
        setResultado(null)
        setAnalisis(null)
        setTrabajando(true)
        try {
            const response = await axios.post('http://localhost:3000/admin/rectificar/analizar', {}, { headers })
            setAnalisis(response.data)

            if (response.data.integra) {
                setMensaje(response.data.message)
                setExito(true)
            }
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al analizar la base de datos")
            setExito(false)
        } finally {
            setTrabajando(false)
        }
    }

    const aplicar = async () => {
        const confirmado = window.confirm("Se van a corregir y eliminar los registros del reporte. Ya hay un backup de respaldo. ¿Continuar?")
        if (!confirmado) return

        setTrabajando(true)
        try {
            const response = await axios.post('http://localhost:3000/admin/rectificar/aplicar',
                { backupArchivo: analisis.backup.archivo },
                { headers }
            )
            setResultado(response.data.resultado)
            setMensaje(response.data.message)
            setExito(true)
            setAnalisis(null)
        } catch (error) {
            setMensaje(error.response?.data?.message || "Error al rectificar la base de datos")
            setExito(false)
        } finally {
            setTrabajando(false)
        }
    }

    // Flujo F3: cancelar no modifica nada, el análisis nunca toca los datos
    const cancelar = () => {
        setAnalisis(null)
        setMensaje("Rectificación cancelada. No se modificó ningún registro.")
        setExito(true)
    }

    return (
        <div style={{ marginTop: '32px' }}>
            <h2>Rectificar base de datos</h2>
            <p style={{ color: 'var(--tinta-suave)', marginBottom: '16px' }}>
                Detecta registros corruptos, duplicados o inconsistentes. Antes de analizar, genera un backup automático.
            </p>

            {mensaje && <div className={exito ? "mensaje-info" : "mensaje-error"}>{mensaje}</div>}

            <button className="btn-primario" onClick={analizar} disabled={trabajando || !!analisis}>
                {trabajando ? "Procesando..." : "Analizar base de datos"}
            </button>

            {analisis && !analisis.integra && (
                <div style={{ marginTop: '24px' }}>
                    <p style={{ color: 'var(--tinta-suave)' }}>Backup automático: {analisis.backup.archivo}</p>

                    <h3>Reporte: {analisis.problemas.length} registros con problemas</h3>
                    <p>
                        Se corrigen: <strong>{analisis.resumen.reparar}</strong> ·
                        Se eliminan: <strong>{analisis.resumen.eliminar}</strong> ·
                        Irreparables: <strong>{analisis.resumen.irreparable}</strong>
                    </p>

                    {analisis.problemas.map(p => (
                        <div key={`${p.tabla}-${p.id}-${p.tipo}`} className={`turno-card estado-${CLASE[p.accion]}`} style={{ opacity: 1 }}>
                            <div className="turno-info">
                                <div className="especialidad">{p.tabla} #{p.id} · {p.tipo}</div>
                                <div className="detalle">{p.detalle}</div>
                            </div>
                            <span className={`badge-estado ${CLASE[p.accion]}`}>{ETIQUETA[p.accion]}</span>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button className="btn-primario" onClick={aplicar} disabled={trabajando}>Confirmar y rectificar</button>
                        <button className="btn-secundario" onClick={cancelar} disabled={trabajando}>Cancelar</button>
                    </div>
                </div>
            )}

            {resultado && (
                <div className="comprobante" style={{ marginTop: '24px' }}>
                    <h3>Resultado</h3>
                    <p>Registros corregidos: <strong>{resultado.corregidos}</strong></p>
                    <p>Registros eliminados: <strong>{resultado.eliminados}</strong></p>
                    <p>No pudieron repararse: <strong>{resultado.irreparables.length}</strong></p>

                    {resultado.irreparables.map(p => (
                        <p key={`${p.tabla}-${p.id}-${p.tipo}`} style={{ fontSize: '0.88rem', color: 'var(--tinta-suave)' }}>
                            · {p.tabla} #{p.id}: {p.detalle}
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RectificarBase