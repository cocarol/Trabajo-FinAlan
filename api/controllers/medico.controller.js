const { Turno, User, FichaClinica, Paciente, Bitacora } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { encriptar, desencriptar } = require('../utils/encriptado')

// CU05 - Visualizar Lista de Pacientes
const listarPacientesDelDia = async (req, res) => {
    try {
        const medicoId = req.user.id || req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_medico; 
        const hoy = new Date().toISOString().split('T')[0]

        const turnosHoy = await Turno.findAll({
            where: {
                fecha: hoy,
                estado: "Pagado" 
            },
            order: [['horario', 'ASC']]
        })

        if (turnosHoy.length === 0) {
            return res.status(404).json({ message: "No registra pacientes asignados para la fecha seleccionada." })
        }

        const pacientesIds = turnosHoy.map(t => t.id_paciente)
        const pacientes = await User.findAll({
            where: { id: pacientesIds },
            attributes: ['id', 'name', 'email']
        })

        const resultado = turnosHoy.map(turno => {
            const paciente = pacientes.find(p => p.id === turno.id_paciente)
            return {
                turnoId: turno.id,
                horario: turno.horario,
                id_paciente: turno.id_paciente,
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

// CU10 - Actualizar Información del Paciente
const actualizarFichaClinica = async (req, res) => {
    try {
        const medicoId = req.user.id || req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_medico; 
        const { id_paciente, peso, altura, presion, observaciones } = req.body

        const vinculo = await MedicoPaciente.findOne({ where: { medicoId, id_paciente } })
        if (!vinculo) {
            return res.status(403).json({ message: "El paciente no pertenece a su lista de atención" })
        }

        const ficha = await FichaClinica.create({
            id_paciente,
            medicoId,
            peso: encriptar(peso),
            altura: encriptar(altura),
            presion: encriptar(presion),
            observaciones: encriptar(observaciones)
        })

        const datosFila = { id: ficha.id, id_paciente, medicoId }
        ficha.dvh = calcularDVH(datosFila)
        ficha.dvv = calcularDVV(ficha.dvh, "")
        await ficha.save()

        await registrarBitacora(medicoId, "ACTUALIZAR_FICHA_CLINICA", { id_paciente })

        res.status(200).json({ message: "Ficha médica actualizada con éxito." })
    } catch (error) {
        res.status(500).json(error)
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
        res.status(500).json(error)
    }
}

// CU12 - Registrar Paciente en la Lista del Médico
const vincularPaciente = async (req, res) => {
    try {
        const id_medico = req.user.id_usuario || req.user.id; 
        const { dni } = req.body;

        const usuario = await User.findOne({ where: { dni } });
        if (!usuario) {
            return res.status(404).json({ message: "El DNI ingresado no pertenece a ningún usuario registrado." });
        }

        const paciente = await Paciente.findOne({ where: { id_usuario: usuario.id_usuario } });
        if (!paciente) {
            return res.status(404).json({ message: "El usuario existe pero no cuenta con un perfil de paciente registrado." });
        }

        if (paciente.id_medico === id_medico) {
            return res.status(400).json({ message: "El paciente ya forma parte de su lista activa." });
        }

        paciente.id_medico = id_medico;

        const datosFila = { id: paciente.id_paciente, id_usuario: paciente.id_usuario, id_medico };
        paciente.dvh = calcularDVH(datosFila);
        paciente.dvv = calcularDVV(paciente.dvh, "");

        await paciente.save();

        await registrarBitacora(id_medico, "VINCULAR_PACIENTE", { id_paciente: paciente.id_paciente });

        res.status(201).json({ message: "Paciente vinculado correctamente a su lista de atención." });
    } catch (error) {
        console.error("Error al vincular DNI:", error);
        res.status(500).json(error);
    }
}

module.exports = {
    listarPacientesDelDia,
    actualizarFichaClinica,
    verFichaClinica,
    vincularPaciente
}