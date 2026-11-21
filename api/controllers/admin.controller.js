const { User, Bitacora, Turno } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { sellarUsuario, usuarioEsConsistente } = require('../utils/integridadUsuario')
const { encriptar } = require('../utils/encriptado')

const ROLES_VALIDOS = ['paciente', 'medico', 'admin']

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: ['id_usuario', 'name', 'email', 'role', 'dni'],
            order: [['name', 'ASC']]
        })

        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json(error)
    }
}

const cambiarRol = async (req, res) => {
    try {
        const adminId = req.user.id_usuario
        const { id } = req.params
        const { nuevoRol } = req.body

        if (!nuevoRol || !ROLES_VALIDOS.includes(nuevoRol)) {
            return res.status(400).json({ message: "Estructura de registro inválida para el cálculo horizontal de integridad." })
        }

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        if (user.id_usuario === adminId) {
            return res.status(400).json({ message: "No podés modificar tu propio rol" })
        }

        if (user.dvh && !usuarioEsConsistente(user)) {
            await registrarBitacora(adminId, "ALERTA_INTRUSION_ROLES", {
                criticidad: "ALTA",
                usuarioAfectado: user.id_usuario
            })
            return res.status(409).json({ message: "Registro corrupto: fallo de consistencia DVV. Edición congelada." })
        }

        const rolAnterior = user.role

        user.role = nuevoRol
        user.firmaRol = encriptar(`${user.id_usuario}:${nuevoRol}`)
        sellarUsuario(user)

        await user.save()

        await registrarBitacora(adminId, "CAMBIAR_ROL", {
            criticidad: "ALTA",
            usuarioAfectado: user.id_usuario,
            rolAnterior,
            rolNuevo: nuevoRol
        })

        res.status(200).json({
            message: `Rol actualizado: ahora ${user.name} es ${nuevoRol}`,
            usuario: { id: user.id_usuario, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// CU09 - Consultar Bitácora
const consultarBitacora = async (req, res) => {
    try {
        const registros = await Bitacora.findAll({
            order: [['cod_bitacora', 'DESC']],
            limit: 100
        });

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ message: "Error al consultar la bitácora", error });
    }
};

// CU15 - Verificar Integridad de la Base de Datos
const verificarIntegridad = async (req, res) => {
    try {
        const errores = [];

        const usuarios = await User.findAll();
        for (const user of usuarios) {
            if (user.dvh) {
                const esperadoSinPass = calcularDVH({ id: user.id_usuario, email: user.email, role: user.role });
                const esValido = usuarioEsConsistente(user) || (esperadoSinPass === user.dvh);

                if (!esValido) {
                    errores.push({ tabla: 'Users', id: user.id_usuario, error: 'DVH Corrupto' });
                }
            }
        }

        const turnos = await Turno.findAll();
        for (const turno of turnos) {
            if (turno.dvh) {
                const base = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente };
                const conMonto = { id: turno.id, estado: turno.estado, id_paciente: turno.id_paciente, monto: turno.monto };
                const soloMonto = { id: turno.id, estado: turno.estado, monto: turno.monto };

                const esValido =
                    turno.dvh === calcularDVH(base) ||
                    turno.dvh === calcularDVH(conMonto) ||
                    turno.dvh === calcularDVH(soloMonto);

                if (!esValido) {
                    errores.push({ tabla: 'Turnos', id: turno.id, error: 'DVH Corrupto' });
                }
            }
        }

        if (errores.length > 0) {
            return res.status(409).json({ message: "Se detectaron registros corruptos", errores });
        }

        res.status(200).json({ message: "Integridad garantizada. Todos los dígitos verificadores son correctos." });
    } catch (error) {
        res.status(500).json({ message: "Error al escanear la base de datos", error });
    }
};

module.exports = {
    listarUsuarios,
    cambiarRol,
    consultarBitacora,
    verificarIntegridad
}