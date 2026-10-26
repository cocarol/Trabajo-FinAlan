const { Turno } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')

const cancelarTurno = async (req, res) => {
    try {
        const { turnoId } = req.params
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId;

        const turno = await Turno.findByPk(turnoId)

        if (turno === null) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (turno.id_paciente !== userId) {
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

        const datosFila = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente }
        turno.dvh = calcularDVH(datosFila)
        turno.dvv = calcularDVV(turno.dvh, turno.dvv)

        await turno.save()

        await registrarBitacora(userId, "CANCELAR_TURNO", { turnoId: turno.id })

        res.status(200).json({ message: "Turno cancelado correctamente", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

const buscarTurnosDisponibles = async (req, res) => {
    try {
        const { especialidad, fecha } = req.query;

        const condiciones = {
            estado: "Disponible"
        };

        if (especialidad) {
            condiciones.especialidad = especialidad;
        }
        
        if (fecha) {
            condiciones.fecha = fecha;
        }

        const turnos = await Turno.findAll({
            where: condiciones
        });

        if (turnos.length === 0) {
            return res.status(404).json({ message: "No hay turnos disponibles para los criterios seleccionados." });
        }

        res.status(200).json(turnos);
    } catch (error) {
        console.error("Error al buscar turnos:", error);
        res.status(500).json({ message: "Error interno del servidor al buscar turnos." });
    }
}

const reservarTurno = async (req, res) => {
    try {
        const { turnoId } = req.body;
        
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "No se pudo identificar al usuario en la sesión." });
        }

        const turno = await Turno.findByPk(turnoId);

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        if (turno.estado !== "Disponible") {
            return res.status(400).json({ message: "El turno ya no está disponible" });
        }

        turno.estado = "Reservado";
        turno.id_paciente = userId;

        const datosFila = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente }
        turno.dvh = calcularDVH(datosFila)
        turno.dvv = calcularDVV(turno.dvh, turno.dvv)

        await turno.save()

        await registrarBitacora(userId, "RESERVAR_TURNO", { turnoId: turno.id })

        res.status(201).json({ message: "Turno reservado con éxito", turno })
    } catch (error) {
        res.status(500).json(error)
    }
}

const pagarConsulta = async (req, res) => {
    try {
        const { turnoId, metodoPago } = req.body
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId;

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

const misTurnos = async (req, res) => {
    try {
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId;

        const turnos = await Turno.findAll({
            where: { id_paciente: userId },
            order: [['fecha', 'ASC']]
        })

        res.status(200).json(turnos)
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
const crearTurno = async (req, res) => {
    try {
        const { especialidad, fecha, horario, ubicacion } = req.body

        if (!especialidad || !fecha || !horario) {
            return res.status(400).json({ message: "Especialidad, fecha y horario son obligatorios" })
        }

        const turno = await Turno.create({
            especialidad,
            fecha,
            horario,
            ubicacion,
            estado: "Disponible",
            id_paciente: 0
        })

        res.status(201).json(turno)
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
    crearTurno
}