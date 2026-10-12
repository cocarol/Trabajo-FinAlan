const { Turno } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')

const cancelarTurno = async (req, res) => {
    try {
        const { turnoId } = req.params
        const userId = req.user.id

        const turno = await Turno.findByPk(turnoId)

        if (turno === null) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.pacienteId !== userId) {
            return res.status(403).json({ message: "Este turno no pertenece al usuario autenticado" })
        }

        if (turno.estado !== "Reservado" && turno.estado !== "Pagado") {
            return res.status(400).json({ message: "El turno no se encuentra en un estado cancelable" })
        }

        // F1: regla de negocio - no cancelar dentro de las 24hs previas
        const fechaTurno = new Date(`${turno.fecha}T${turno.horario}`)
        const ahora = new Date()
        const horasRestantes = (fechaTurno - ahora) / (1000 * 60 * 60)

        if (horasRestantes < 24) {
            return res.status(400).json({ message: "No se puede cancelar el turno fuera del plazo permitido." })
        }

        turno.estado = "Cancelado"

        const datosFila = { id: turno.id, estado: turno.estado, pacienteId: turno.pacienteId }
        turno.dvh = calcularDVH(datosFila)
        turno.dvv = calcularDVV(turno.dvh, turno.dvv)

        await turno.save()

        await registrarBitacora(userId, "CANCELAR_TURNO", { turnoId: turno.id })

        res.status(200).json({ message: "Turno cancelado correctamente", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    cancelarTurno
}
const buscarTurnosDisponibles = async (req, res) => {
    try {
        const { especialidad, fecha } = req.query

        const turnos = await Turno.findAll({
            where: {
                especialidad,
                fecha,
                estado: "Disponible"
            }
        })

        if (turnos.length === 0) {
            return res.status(404).json({ message: "No hay turnos disponibles para los criterios seleccionados." })
        }

        res.status(200).json(turnos)
    } catch (error) {
        res.status(500).json(error)
    }
}

const reservarTurno = async (req, res) => {
    try {
        const { turnoId } = req.body
        const userId = req.user.id

        const turno = await Turno.findByPk(turnoId)

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.estado !== "Disponible") {
            return res.status(400).json({ message: "El turno ya no está disponible" })
        }

        turno.estado = "Reservado"
        turno.pacienteId = userId

        const datosFila = { id: turno.id, estado: turno.estado, pacienteId: turno.pacienteId }
        turno.dvh = calcularDVH(datosFila)
        turno.dvv = calcularDVV(turno.dvh, turno.dvv)

        await turno.save()

        await registrarBitacora(userId, "RESERVAR_TURNO", { turnoId: turno.id })

        res.status(201).json({ message: "Turno reservado con éxito", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    cancelarTurno,
    buscarTurnosDisponibles,
    reservarTurno
}
const pagarConsulta = async (req, res) => {
    try {
        const { turnoId, metodoPago } = req.body
        const userId = req.user.id

        const turno = await Turno.findByPk(turnoId)

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.pacienteId !== userId) {
            return res.status(403).json({ message: "Este turno no pertenece al usuario autenticado" })
        }

        if (turno.estado !== "Reservado") {
            return res.status(400).json({ message: "El turno debe estar en estado Reservado para poder pagarse" })
        }

        // Simulación de la pasarela externa de pago (Actor Secundario)
        const resultadoPasarela = await simularPasarelaDePago(metodoPago)

        if (resultadoPasarela.estado !== "Aprobado") {
            // F1: transacción rechazada
            return res.status(400).json({ message: "Transacción rechazada por la entidad emisora. Intente con otra tarjeta." })
        }

        turno.estado = "Pagado"
        turno.monto = resultadoPasarela.monto

        const datosFila = { id: turno.id, estado: turno.estado, monto: turno.monto }
        turno.dvh = calcularDVH(datosFila)
        turno.dvv = calcularDVV(turno.dvh, turno.dvv)

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

// Simula el Actor Secundario "Métodos de Pago (Pasarela externa)"
const simularPasarelaDePago = async (metodoPago) => {
    return {
        estado: "Aprobado",
        monto: 5000,
        token: "TOKEN-" + Date.now()
    }
}

module.exports = {
    cancelarTurno,
    buscarTurnosDisponibles,
    reservarTurno,
    pagarConsulta
}