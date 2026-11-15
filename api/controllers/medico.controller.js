const { Turno, User, FichaClinica, Paciente, MedicoPaciente } = require('../models/index')
const { Op } = require('sequelize')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { encriptar, desencriptar } = require('../utils/encriptado')

// CU05 - Visualizar Lista de Pacientes
const listarPacientesDelDia = async (req, res) => {
    try {
        const medicoId = req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_medico
        const hoy = new Date().toISOString().split('T')[0]

        // 1. Buscar turnos activos (de hoy o próximos reservado/pagado/confirmado)
        let turnosHoy = await Turno.findAll({
            where: {
                fecha: hoy,
                estado: { [Op.in]: ["Reservado", "Pagado", "Confirmado"] },
                [Op.or]: [
                    { id_medico: medicoId },
                    { id_medico: null }
                ]
            },
            order: [['horario', 'ASC']]
        })

        // Si no hay turnos exactamente con la fecha de hoy, traemos todos los turnos activos reservados/pagados/confirmados para que el médico pueda verlos
        if (turnosHoy.length === 0) {
            turnosHoy = await Turno.findAll({
                where: {
                    estado: { [Op.in]: ["Reservado", "Pagado", "Confirmado"] },
                    id_paciente: { [Op.gt]: 0 }
                },
                order: [['fecha', 'ASC'], ['horario', 'ASC']]
            })
        }

        // 2. Buscar también pacientes vinculados directamente al médico
        const vinculados = await MedicoPaciente.findAll({ where: { medicoId } })
        const idsDeTurnos = turnosHoy.map(t => t.id_paciente).filter(Boolean)
        const idsVinculados = vinculados.map(v => v.id_paciente).filter(Boolean)
        const todosLosIds = [...new Set([...idsDeTurnos, ...idsVinculados])]

        if (todosLosIds.length === 0) {
            return res.status(404).json({ message: "No registra pacientes asignados para la fecha seleccionada." })
        }

        const pacientes = await User.findAll({
            where: { id_usuario: todosLosIds },
            attributes: ['id_usuario', 'name', 'email', 'dni']
        })

        const resultado = []

        // Agregar los que tienen turno
        for (const turno of turnosHoy) {
            const paciente = pacientes.find(p => p.id_usuario === turno.id_paciente)
            resultado.push({
                turnoId: turno.id,
                horario: `${turno.fecha} ${turno.horario}`,
                id_paciente: turno.id_paciente,
                nombre: paciente ? paciente.name : "Paciente #" + turno.id_paciente,
                dni: paciente?.dni || "-",
                especialidad: turno.especialidad,
                estado: turno.estado
            })
        }

        // Agregar los vinculados manualmente que no tenían turno en la lista anterior
        for (const v of vinculados) {
            if (!resultado.some(r => r.id_paciente === v.id_paciente)) {
                const paciente = pacientes.find(p => p.id_usuario === v.id_paciente)
                if (paciente) {
                    resultado.push({
                        turnoId: `vinc-${v.id}`,
                        horario: "Lista de atención",
                        id_paciente: paciente.id_usuario,
                        nombre: paciente.name,
                        dni: paciente.dni || "-",
                        especialidad: "Paciente Vinculado",
                        estado: "Activo"
                    })
                }
            }
        }

        await registrarBitacora(medicoId, "VISUALIZAR_LISTA_PACIENTES", { fecha: hoy, cantidad: resultado.length })

        res.status(200).json(resultado)
    } catch (error) {
        console.error("Error en listarPacientesDelDia:", error)
        res.status(500).json({ message: "Error al obtener pacientes del día", error: error.message })
    }
}

// CU10 - Actualizar Información del Paciente
const actualizarFichaClinica = async (req, res) => {
    try {
        const medicoId = req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_medico
        const { id_paciente, peso, altura, presion, observaciones } = req.body

        // Si aún no estaba vinculado formalmente pero tiene turno con el médico, lo vinculamos automáticamente
        let vinculo = await MedicoPaciente.findOne({ where: { medicoId, id_paciente } })
        if (!vinculo) {
            vinculo = await MedicoPaciente.create({ medicoId, id_paciente })
        }

        const ficha = await FichaClinica.create({
            id_paciente,
            medicoId,
            peso: encriptar(String(peso)),
            altura: encriptar(String(altura)),
            presion: encriptar(String(presion)),
            observaciones: encriptar(String(observaciones))
        })

        const datosFila = { id: ficha.id, id_paciente, medicoId }
        ficha.dvh = calcularDVH(datosFila)
        ficha.dvv = calcularDVV(ficha.dvh, "")
        await ficha.save()

        await registrarBitacora(medicoId, "ACTUALIZAR_FICHA_CLINICA", { id_paciente })

        res.status(200).json({ message: "Ficha médica actualizada con éxito." })
    } catch (error) {
        console.error("Error en actualizarFichaClinica:", error)
        res.status(500).json({ message: "Error al guardar la ficha clínica", error: error.message })
    }
}

const verFichaClinica = async (req, res) => {
    try {
        const { id_paciente } = req.params

        const fichas = await FichaClinica.findAll({
            where: { id_paciente },
            order: [['id', 'DESC']]
        })

        const fichasDescifradas = fichas.map(f => ({
            id: f.id,
            peso: desencriptar(f.peso),
            altura: desencriptar(f.altura),
            presion: desencriptar(f.presion),
            observaciones: desencriptar(f.observaciones)
        }))

        res.status(200).json(fichasDescifradas)
    } catch (error) {
        console.error("Error en verFichaClinica:", error)
        res.status(500).json({ message: "Error al leer la ficha clínica", error: error.message })
    }
}

// CU12 - Registrar Paciente en la Lista del Médico
const vincularPaciente = async (req, res) => {
    try {
        const medicoId = req.user?.id_usuario || req.user?.id
        const { dni } = req.body

        if (!dni) {
            return res.status(400).json({ message: "Debe ingresar el DNI del paciente." })
        }

        const usuario = await User.findOne({ where: { dni: String(dni).trim() } })
        if (!usuario) {
            return res.status(404).json({ message: "El DNI ingresado no pertenece a ningún usuario registrado en la plataforma. Solicite al paciente que cree una cuenta." })
        }

        const yaVinculado = await MedicoPaciente.findOne({
            where: { medicoId, id_paciente: usuario.id_usuario }
        })

        if (yaVinculado) {
            return res.status(400).json({ message: "El paciente ya forma parte de su lista activa." })
        }

        const vinculo = await MedicoPaciente.create({
            medicoId,
            id_paciente: usuario.id_usuario
        })

        const datosFila = { id: vinculo.id, medicoId, id_paciente: usuario.id_usuario }
        vinculo.dvh = calcularDVH(datosFila)
        vinculo.dvv = calcularDVV(vinculo.dvh, "")
        await vinculo.save()

        // Actualizamos también la tabla Paciente por compatibilidad 1:N
        let paciente = await Paciente.findOne({ where: { id_usuario: usuario.id_usuario } })
        if (!paciente) {
            paciente = await Paciente.create({ id_usuario: usuario.id_usuario, id_medico: medicoId })
        } else {
            paciente.id_medico = medicoId
            await paciente.save()
        }

        await registrarBitacora(medicoId, "VINCULAR_PACIENTE", { id_paciente: usuario.id_usuario })

        res.status(201).json({ message: "Paciente vinculado correctamente a su lista de atención." })
    } catch (error) {
        console.error("Error al vincular DNI:", error)
        res.status(500).json({ message: "Error interno al vincular el paciente", error: error.message })
    }
}

module.exports = {
    listarPacientesDelDia,
    actualizarFichaClinica,
    verFichaClinica,
    vincularPaciente
}