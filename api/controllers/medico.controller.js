const { Turno, User, FichaClinica, MedicoPaciente, Bitacora } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { encriptar, desencriptar } = require('../utils/encriptado')

// CU05 - Visualizar Lista de Pacientes
const listarPacientesDelDia = async (req, res) => {
    try {
        const medicoId = req.user.id
        const hoy = new Date().toISOString().split('T')[0] // YYYY-MM-DD

        const turnosHoy = await Turno.findAll({
            where: {
                fecha: hoy,
                estado: "Pagado" // equivalente a "Confirmado" en este sistema
            },
            order: [['horario', 'ASC']]
        })

        if (turnosHoy.length === 0) {
            return res.status(404).json({ message: "No registra pacientes asignados para la fecha seleccionada." })
        }

        const pacientesIds = turnosHoy.map(t => t.pacienteId)
        const pacientes = await User.findAll({
            where: { id: pacientesIds },
            attributes: ['id', 'name', 'email']
        })

        const resultado = turnosHoy.map(turno => {
            const paciente = pacientes.find(p => p.id === turno.pacienteId)
            return {
                turnoId: turno.id,
                horario: turno.horario,
                pacienteId: turno.pacienteId,
                nombre: paciente ? paciente.name : "Desconocido",
                especialidad: turno.especialidad
            }
        })

        await registrarBitacora(medicoId, "VISUALIZAR_LISTA_PACIENTES", { fecha: hoy, cantidad: resultado.length })

        res.status(200).json(resultado)
    } catch (error) {
        res.status(500).json(error)
    }
}

// CU10 - Actualizar Información del Paciente (ficha clínica)
const actualizarFichaClinica = async (req, res) => {
    try {
        const medicoId = req.user.id
        const { pacienteId, peso, altura, presion, observaciones } = req.body

        const vinculo = await MedicoPaciente.findOne({ where: { medicoId, pacienteId } })
        if (!vinculo) {
            return res.status(403).json({ message: "El paciente no pertenece a su lista de atención" })
        }

        const ficha = await FichaClinica.create({
            pacienteId,
            medicoId,
            peso: encriptar(peso),
            altura: encriptar(altura),
            presion: encriptar(presion),
            observaciones: encriptar(observaciones)
        })

        const datosFila = { id: ficha.id, pacienteId, medicoId }
        ficha.dvh = calcularDVH(datosFila)
        ficha.dvv = calcularDVV(ficha.dvh, "")
        await ficha.save()

        await registrarBitacora(medicoId, "ACTUALIZAR_FICHA_CLINICA", { pacienteId })

        res.status(200).json({ message: "Ficha médica actualizada con éxito." })
    } catch (error) {
        res.status(500).json(error)
    }
}

// Para mostrar la ficha ya descifrada en el frontend
const verFichaClinica = async (req, res) => {
    try {
        const { pacienteId } = req.params

        const fichas = await FichaClinica.findAll({
            where: { pacienteId },
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
        res.status(500).json(error)
    }
}

// CU12 - Registrar Paciente en la Lista del Médico
const vincularPaciente = async (req, res) => {
    try {
        const medicoId = req.user.id
        const { dni } = req.body

        const paciente = await User.findOne({ where: { dni } })

        if (!paciente) {
            return res.status(404).json({ message: "El DNI ingresado no pertenece a ningún usuario registrado en la plataforma. Solicite al paciente que cree una cuenta." })
        }

        const yaVinculado = await MedicoPaciente.findOne({ where: { medicoId, pacienteId: paciente.id } })

        if (yaVinculado) {
            return res.status(400).json({ message: "El paciente ya forma parte de su lista activa." })
        }

        const vinculo = await MedicoPaciente.create({ medicoId, pacienteId: paciente.id })

        const datosFila = { id: vinculo.id, medicoId, pacienteId: paciente.id }
        vinculo.dvh = calcularDVH(datosFila)
        vinculo.dvv = calcularDVV(vinculo.dvh, "")
        await vinculo.save()

        await registrarBitacora(medicoId, "VINCULAR_PACIENTE", { pacienteId: paciente.id })

        res.status(201).json({ message: "Paciente vinculado correctamente a su lista de atención." })
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    listarPacientesDelDia,
    actualizarFichaClinica,
    verFichaClinica,
    vincularPaciente
}