const { User } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { calcularDVH, calcularDVV } = require('../utils/digitosVerificadores')
const { encriptar } = require('../utils/encriptado')

const ROLES_VALIDOS = ['paciente', 'medico', 'admin']

// Pasos A-B: lista completa de usuarios
const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'dni'],
            order: [['name', 'ASC']]
        })

        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json(error)
    }
}

// Pasos C-I: cambiar el rol de un usuario
const cambiarRol = async (req, res) => {
    try {
        const adminId = req.user.id
        const { id } = req.params
        const { nuevoRol } = req.body

        // F1: estructura inválida
        if (!nuevoRol || !ROLES_VALIDOS.includes(nuevoRol)) {
            return res.status(400).json({ message: "Error de calculo en los digitos verificadores" })
        }

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        // Un admin no puede quitarse el rol a sí mismo (se quedaría sin acceso)
        if (user.id === adminId) {
            return res.status(400).json({ message: "No podés modificar tu propio rol" })
        }

        // F2: verificar consistencia del registro antes de modificarlo
        if (user.dvh) {
            const esperado = calcularDVH({ id: user.id, email: user.email, role: user.role })

            if (esperado !== user.dvh) {
                await registrarBitacora(adminId, "ALERTA_INTRUSION_ROLES", {
                    criticidad: "ALTA",
                    usuarioAfectado: user.id
                })
                return res.status(409).json({ message: "Registro corrupto: fallo de consistencia DVV. Edición congelada." })
            }
        }

        const rolAnterior = user.role

        user.role = nuevoRol
        user.firmaRol = encriptar(`${user.id}:${nuevoRol}`)             // paso F
        user.dvh = calcularDVH({ id: user.id, email: user.email, role: nuevoRol })   // paso G
        user.dvv = calcularDVV(user.dvh, user.dvv || "")

        await user.save()

        // paso H: alerta de alta criticidad
        await registrarBitacora(adminId, "CAMBIAR_ROL", {
            criticidad: "ALTA",
            usuarioAfectado: user.id,
            rolAnterior,
            rolNuevo: nuevoRol
        })

        res.status(200).json({
            message: `Rol actualizado: ahora ${user.name} es ${nuevoRol}`,
            usuario: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    listarUsuarios,
    cambiarRol
}