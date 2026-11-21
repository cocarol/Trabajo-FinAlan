const fs = require('fs')
const path = require('path')
const { sequelize } = require('../config/db')
const { User, Turno, FichaClinica, MedicoPaciente } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { sellarUsuario, usuarioEsConsistente } = require('../utils/integridadUsuario')
const { desencriptar } = require('../utils/encriptado')
const mantenimiento = require('../middlewares/mantenimiento')
const { generarBackup, ErrorNegocio, manejarError, CARPETA, NOMBRE_VALIDO } = require('./backup.controller')

const ROLES = ['paciente', 'medico', 'admin']
const ESTADOS_TURNO = ['Disponible', 'Reservado', 'Pagado', 'Confirmado', 'Cancelado']
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CAMPOS_CIFRADOS = ['peso', 'altura', 'presion', 'observaciones']

const sellarTurno = (turno) => {
    const datosFila = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente }
    if (turno.monto) datosFila.monto = turno.monto
    turno.dvh = calcularDVH(datosFila)
    turno.dvv = calcularDVV(turno.dvh, turno.dvv || "")
}

// Pasos D y E: revisa las tablas y devuelve la lista de problemas. No modifica nada.
const analizar = async (transaccion) => {
    const opciones = transaccion ? { raw: true, transaction: transaccion } : { raw: true }

    const usuarios = await User.findAll(opciones)
    const turnos = await Turno.findAll(opciones)
    const vinculos = MedicoPaciente ? await MedicoPaciente.findAll(opciones) : []
    const fichas = FichaClinica ? await FichaClinica.findAll(opciones) : []

    const idsUsuarios = new Set(usuarios.map(u => u.id_usuario))
    const problemas = []
    const agregar = (tabla, id, tipo, detalle, accion) => problemas.push({ tabla, id, tipo, detalle, accion })

    // ----- users -----
    for (const u of usuarios) {
        let irreparable = false

        if (!ROLES.includes(u.role)) {
            agregar('users', u.id_usuario, 'ROL_INVALIDO', `Rol "${u.role}" no reconocido`, 'irreparable')
            irreparable = true
        }
        if (!u.email || !EMAIL_VALIDO.test(u.email)) {
            agregar('users', u.id_usuario, 'EMAIL_INVALIDO', 'Email vacío o con formato inválido', 'irreparable')
            irreparable = true
        }
        if (!irreparable && !usuarioEsConsistente(u)) {
            agregar('users', u.id_usuario, 'DVH_INCONSISTENTE', 'Los dígitos verificadores no coinciden con los datos de la fila', 'reparar')
        }
    }

    // ----- turnos: duplicados (solo Disponibles) -----
    const duplicados = new Set()
    const vistos = new Map()
    const disponibles = turnos.filter(x => x.estado === 'Disponible').sort((a, b) => b.id - a.id)

    for (const x of disponibles) {
        const clave = [x.especialidad, x.fecha, x.horario, x.ubicacion || ''].join('|').toLowerCase()

        if (vistos.has(clave)) {
            duplicados.add(x.id)
            agregar('turnos', x.id, 'TURNO_DUPLICADO', `Repite al turno #${vistos.get(clave)}`, 'eliminar')
        } else {
            vistos.set(clave, x.id)
        }
    }

    // ----- turnos: estructura -----
    for (const turno of turnos) {
        if (duplicados.has(turno.id)) continue

        const pacId = turno.id_paciente ?? 0

        if (!ESTADOS_TURNO.includes(turno.estado)) {
            agregar('turnos', turno.id, 'ESTADO_INVALIDO', `Estado "${turno.estado}" no reconocido`, 'irreparable')
        } else if ((turno.estado === 'Pagado' || turno.estado === 'Confirmado') && !pacId) {
            agregar('turnos', turno.id, 'PAGADO_SIN_PACIENTE', 'Turno pagado sin paciente asignado', 'irreparable')
        } else if (turno.estado === 'Reservado' && !pacId) {
            agregar('turnos', turno.id, 'RESERVADO_SIN_PACIENTE', 'Turno reservado sin paciente: vuelve a Disponible', 'reparar')
        } else if (turno.estado === 'Reservado' && !idsUsuarios.has(pacId)) {
            agregar('turnos', turno.id, 'PACIENTE_INEXISTENTE', 'El paciente de la reserva ya no existe: vuelve a Disponible', 'reparar')
        } else if (turno.estado === 'Disponible' && pacId !== 0 && pacId !== null) {
            agregar('turnos', turno.id, 'DISPONIBLE_CON_PACIENTE', 'Turno disponible con paciente asignado', 'reparar')
        } else if (turno.dvh) {
            const datosFila = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente }
            if (turno.monto) datosFila.monto = turno.monto
            if (calcularDVH(datosFila) !== turno.dvh) {
                agregar('turnos', turno.id, 'DVH_INCONSISTENTE', 'Los dígitos verificadores del turno no coinciden', 'reparar')
            }
        }
    }

    // ----- medico_paciente -----
    const vinculosVistos = new Set()
    for (const v of [...vinculos].sort((a, b) => b.id - a.id)) {
        const medId = v.medicoId ?? v.id_medico
        const pacId = v.id_paciente ?? v.pacienteId

        if (!idsUsuarios.has(medId) || !idsUsuarios.has(pacId)) {
            agregar('medico_paciente', v.id, 'VINCULO_HUERFANO', 'El médico o el paciente del vínculo ya no existe', 'eliminar')
            continue
        }

        const clave = `${medId}-${pacId}`
        if (vinculosVistos.has(clave)) {
            agregar('medico_paciente', v.id, 'VINCULO_DUPLICADO', 'Vínculo médico-paciente repetido', 'eliminar')
        } else {
            vinculosVistos.add(clave)
        }
    }

    // ----- fichas clínicas -----
    for (const f of fichas) {
        for (const campo of CAMPOS_CIFRADOS) {
            if (!f[campo]) continue

            try {
                desencriptar(f[campo])
            } catch (error) {
                agregar('fichas_clinicas', f.id, 'FICHA_ILEGIBLE', `El campo "${campo}" no se puede descifrar`, 'irreparable')
                break
            }
        }
    }

    return problemas
}

const resumir = (problemas) => problemas.reduce((acc, p) => {
    acc[p.accion] += 1
    return acc
}, { reparar: 0, eliminar: 0, irreparable: 0 })

// Pasos A-F: backup automático + reporte. No modifica ningún registro.
const analizarBase = async (req, res) => {
    try {
        const adminId = req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_admin

        let backup
        try {
            backup = await generarBackup(adminId, { omitirIntegridad: true })
        } catch (error) {
            throw new ErrorNegocio(500, `El backup automático falló (${error.message}). No es seguro continuar sin una copia de respaldo.`)
        }

        const problemas = await analizar()

        await registrarBitacora(adminId, "RECTIFICAR_ANALISIS", { backup: backup.archivo, problemas: problemas.length })

        if (problemas.length === 0) {
            return res.status(200).json({
                integra: true,
                message: "La base de datos se encuentra íntegra y no requiere rectificación.",
                backup
            })
        }

        res.status(200).json({ integra: false, backup, problemas, resumen: resumir(problemas) })
    } catch (error) {
        manejarError(res, error)
    }
}

// Pasos G-M: el admin ya confirmó, se aplican los cambios.
const aplicarRectificacion = async (req, res) => {
    try {
        const adminId = req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_admin
        const { backupArchivo } = req.body

        if (!backupArchivo || !NOMBRE_VALIDO.test(backupArchivo) || !fs.existsSync(path.join(CARPETA, backupArchivo))) {
            throw new ErrorNegocio(400, "No se encontró el backup previo. Volvé a analizar la base antes de rectificar.")
        }

        const resultado = { corregidos: 0, eliminados: 0, irreparables: [] }
        const cambios = []

        mantenimiento.activar()

        try {
            const t = await sequelize.transaction()

            try {
                const problemas = await analizar(t)

                for (const p of problemas) {
                    if (p.accion === 'irreparable') {
                        resultado.irreparables.push(p)
                        continue
                    }

                    if (p.accion === 'eliminar') {
                        const modelo = p.tabla === 'turnos' ? Turno : MedicoPaciente
                        await modelo.destroy({ where: { id: p.id }, transaction: t })
                        resultado.eliminados++
                    } else if (p.tabla === 'users') {
                        const user = await User.findByPk(p.id, { transaction: t })
                        sellarUsuario(user)
                        await user.save({ transaction: t })
                        resultado.corregidos++
                    } else if (p.tabla === 'turnos') {
                        const turno = await Turno.findByPk(p.id, { transaction: t })
                        if (p.tipo !== 'DVH_INCONSISTENTE') {
                            turno.estado = 'Disponible'
                            turno.id_paciente = 0
                            turno.monto = null
                        }
                        sellarTurno(turno)
                        await turno.save({ transaction: t })
                        resultado.corregidos++
                    }

                    cambios.push({ tabla: p.tabla, id: p.id, tipo: p.tipo, accion: p.accion })
                }

                const restantes = await analizar(t)
                if (restantes.some(p => p.accion !== 'irreparable')) {
                    throw new ErrorNegocio(500, "La verificación posterior detectó inconsistencias. Se revirtieron todos los cambios.")
                }

                await t.commit()
            } catch (error) {
                if (!t.finished) await t.rollback()
                throw error
            }
        } finally {
            mantenimiento.desactivar()
        }

        await registrarBitacora(adminId, "RECTIFICAR_BASE", {
            backup: backupArchivo,
            corregidos: resultado.corregidos,
            eliminados: resultado.eliminados,
            irreparables: resultado.irreparables.length,
            cambios
        })

        res.status(200).json({ message: "Rectificación completada.", resultado })
    } catch (error) {
        manejarError(res, error)
    }
}

module.exports = {
    analizarBase,
    aplicarRectificacion
}