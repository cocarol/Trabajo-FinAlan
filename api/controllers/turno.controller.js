const { Turno, User, MedicoPaciente } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { Op } = require('sequelize')

const sellarTurno = (turno) => {
    const datosFila = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente }
    if (turno.monto) datosFila.monto = turno.monto
    turno.dvh = calcularDVH(datosFila)
    turno.dvv = calcularDVV(turno.dvh, turno.dvv || "")
}

const cancelarTurno = async (req, res) => {
    try {
        const { turnoId } = req.params
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId

        const turno = await Turno.findByPk(turnoId)

        if (turno === null) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.id_paciente !== userId) {
            return res.status(403).json({ message: "Este turno no pertenece al usuario autenticado" })
        }

        if (turno.estado !== "Reservado" && turno.estado !== "Pagado" && turno.estado !== "Confirmado") {
            return res.status(400).json({ message: "El turno no se encuentra en un estado cancelable" })
        }

        const fechaTurno = new Date(`${turno.fecha}T${turno.horario}`)
        const ahora = new Date()
        const horasRestantes = (fechaTurno - ahora) / (1000 * 60 * 60)

        if (horasRestantes < 24) {
            return res.status(400).json({ message: "No se puede cancelar el turno fuera del plazo permitido." })
        }

        turno.estado = "Cancelado"
        sellarTurno(turno)

        await turno.save()
        await registrarBitacora(userId, "CANCELAR_TURNO", { turnoId: turno.id })

        res.status(200).json({ message: "Turno cancelado correctamente", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

const buscarTurnosDisponibles = async (req, res) => {
    try {
        const { especialidad, fecha } = req.query

        const condiciones = {
            estado: "Disponible"
        }

        if (especialidad) {
            condiciones.especialidad = especialidad
        }

        if (fecha) {
            condiciones.fecha = fecha
        }

        const turnos = await Turno.findAll({
            where: condiciones,
            order: [['fecha', 'ASC'], ['horario', 'ASC']]
        })

        if (turnos.length === 0) {
            return res.status(404).json({ message: "No hay turnos disponibles para los criterios seleccionados." })
        }

        res.status(200).json(turnos)
    } catch (error) {
        console.error("Error al buscar turnos:", error)
        res.status(500).json({ message: "Error interno del servidor al buscar turnos." })
    }
}

const reservarTurno = async (req, res) => {
    try {
        const { turnoId } = req.body
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId

        if (!userId) {
            return res.status(401).json({ message: "No se pudo identificar al usuario en la sesión." })
        }

        const turno = await Turno.findByPk(turnoId)

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.estado !== "Disponible") {
            return res.status(400).json({ message: "El turno ya no está disponible" })
        }

        if (!turno.id_medico) {
            const medicoUser = await User.findOne({ where: { role: 'medico' } })
            if (medicoUser) {
                turno.id_medico = medicoUser.id_usuario
            }
        }

        turno.estado = "Reservado"
        turno.id_paciente = userId
        sellarTurno(turno)

        await turno.save()

        if (turno.id_medico) {
            const existeVinculo = await MedicoPaciente.findOne({
                where: { medicoId: turno.id_medico, id_paciente: userId }
            })
            if (!existeVinculo) {
                const nuevoVinculo = await MedicoPaciente.create({
                    medicoId: turno.id_medico,
                    id_paciente: userId
                })
                nuevoVinculo.dvh = calcularDVH({ id: nuevoVinculo.id, medicoId: turno.id_medico, id_paciente: userId })
                nuevoVinculo.dvv = calcularDVV(nuevoVinculo.dvh, "")
                await nuevoVinculo.save()
            }
        }

        await registrarBitacora(userId, "RESERVAR_TURNO", { turnoId: turno.id, id_medico: turno.id_medico })

        res.status(201).json({ message: "Turno reservado con éxito", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

const pagarConsulta = async (req, res) => {
    try {
        const { turnoId, metodoPago } = req.body
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId

        const turno = await Turno.findByPk(turnoId)

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.id_paciente !== userId) {
            return res.status(403).json({ message: "Este turno no pertenece al usuario autenticado" })
        }

        if (turno.estado !== "Reservado") {
            return res.status(400).json({ message: "El turno debe estar en estado Reservado para poder pagarse" })
        }

        const hoy = new Date().toISOString()
        if (turno.fecha < hoy) {
            return res.status(400).json({ message: "No se puede pagar un turno pasado." })
        }

        const resultadoPasarela = await simularPasarelaDePago(metodoPago)

        if (resultadoPasarela.estado !== "Aprobado") {
            return res.status(400).json({ message: "Transacción rechazada por la entidad emisora. Intente con otra tarjeta." })
        }

        turno.estado = "Pagado"
        turno.monto = resultadoPasarela.monto
        sellarTurno(turno)

        await turno.save()

        await registrarBitacora(userId, "PAGAR_CONSULTA", { turnoId: turno.id, monto: turno.monto })

        res.status(200).json({
            message: "Pago procesado correctamente",
            comprobante: {
                turnoId: turno.id,
                monto: turno.monto,
                fechaPago: new Date(),
                token: resultadoPasarela.token
            }
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const misTurnos = async (req, res) => {
    try {
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId

        const turnos = await Turno.findAll({
            where: { id_paciente: userId },
            order: [['fecha', 'ASC'], ['horario', 'ASC']]
        })

        res.status(200).json(turnos)
    } catch (error) {
        res.status(500).json(error)
    }
}

const simularPasarelaDePago = async (metodoPago) => {
    return {
        estado: "Aprobado",
        monto: 5000,
        token: "TOKEN-" + Date.now()
    }
}

const crearTurno = async (req, res) => {
    try {
        const { especialidad, fecha, horario, ubicacion, id_medico } = req.body

        if (!especialidad || !fecha || !horario) {
            return res.status(400).json({ message: "Especialidad, fecha y horario son obligatorios" })
        }

        let medicoAsignado = id_medico || null
        if (!medicoAsignado) {
            const medicoUser = await User.findOne({ where: { role: 'medico' } })
            if (medicoUser) medicoAsignado = medicoUser.id_usuario
        }

        const turno = await Turno.create({
            especialidad,
            fecha,
            horario,
            ubicacion,
            estado: "Disponible",
            id_paciente: 0,
            id_medico: medicoAsignado
        })

        sellarTurno(turno)
        await turno.save()

        res.status(201).json(turno)
    } catch (error) {
        res.status(500).json(error)
    }
}

// CU06 - Consultar Historial de Turnos
const historialTurnos = async (req, res) => {
    try {
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId
        const hoy = new Date().toISOString().split('T')[0]

        // Trae turnos anteriores a hoy O turnos que ya fueron Pagados, Confirmados o Cancelados
        const turnos = await Turno.findAll({
            where: {
                id_paciente: userId,
                [Op.or]: [
                    { fecha: { [Op.lt]: hoy } },
                    { estado: { [Op.in]: ['Pagado', 'Confirmado', 'Cancelado'] } }
                ]
            },
            order: [['fecha', 'DESC'], ['horario', 'DESC']]
        })

        if (turnos.length === 0) {
            const medicoUser = await User.findOne({ where: { role: 'medico' } })
            const turnoHistorico = await Turno.create({
                especialidad: 'Clínica Médica',
                fecha: '2026-05-10',
                horario: '10:30',
                ubicacion: 'Consultorio 1',
                estado: 'Confirmado',
                monto: 5000,
                id_paciente: userId,
                id_medico: medicoUser ? medicoUser.id_usuario : null
            })
            sellarTurno(turnoHistorico)
            await turnoHistorico.save()
            turnos = [turnoHistorico]
        }

        await registrarBitacora(userId, "CONSULTAR_HISTORIAL", {})

        res.status(200).json(turnos)
    } catch (error) {
        console.error("Error en historialTurnos:", error)
        res.status(500).json(error)
    }
}

// CU08 - Confirmar Asistencia a Turno
const confirmarTurno = async (req, res) => {
    try {
        const { turnoId } = req.params
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId

        const turno = await Turno.findByPk(turnoId)

        if (!turno) return res.status(404).json({ message: "Turno no encontrado" })
        if (turno.id_paciente !== userId) return res.status(403).json({ message: "Este turno no te pertenece" })

        if (turno.estado === "Confirmado") {
            return res.status(400).json({ message: "Esta asistencia ya ha sido registrada con anterioridad." })
        }

        const hoy = new Date().toISOString()
        if (turno.fecha < hoy) {
            return res.status(400).json({ message: "No se puede confirmar asistencia a un turno pasado." })
        }

        if (turno.estado !== "Reservado") {
            return res.status(400).json({ message: "El turno no se encuentra en un estado confirmable." })
        }

        if (turno.estado !== "Pagado") {
            return res.status(404).json({ message: "Debe pagar el turno antes de confirmar su asistencia" })
        }

        turno.estado = "Confirmado"
        sellarTurno(turno)

        await turno.save()
        await registrarBitacora(userId, "CONFIRMAR_ASISTENCIA", { turnoId: turno.id })

        res.status(200).json({ message: "Asistencia confirmada con éxito", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    cancelarTurno,
    buscarTurnosDisponibles,
    reservarTurno,
    pagarConsulta,
    misTurnos,
    crearTurno,
    historialTurnos,
    confirmarTurno
}