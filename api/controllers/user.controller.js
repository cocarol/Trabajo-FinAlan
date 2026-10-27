const { User, Turno, Medico } = require('../models/index')
const { sequelize } = require('../config/db')
const { Op } = require('sequelize')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registrarBitacora } = require('../utils/bitacora')
const { sellarUsuario } = require('../utils/integridadUsuario')

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (name === null || email === null || password === null) {
            return res.status(400).json({ message: "Faltan campos obligatorios" })
        }

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "Ya existe un usuario con ese email" })
        }

        const hashedPassword = await bcrypt.hash(password, 11)

        const userCreated = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            id_usuario: userCreated.id_usuario,
            name: userCreated.name,
            email: userCreated.email
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const searchedUser = await User.findOne({ where: { email } })

        if (!searchedUser) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" })
        }

        const match = await bcrypt.compare(password, searchedUser.password)

        if (!match) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" })
        }

        const token = await jwt.sign(
            { id_usuario: searchedUser.id_usuario, email: searchedUser.email, role: searchedUser.role },
            'misecreto',
            { expiresIn: '1h' }
        )

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json(error)
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user?.id_usuario || req.user?.id || req.user?.userId || req.user?.id_paciente, {
            attributes: { exclude: ['password'] }
        })

        if (user === null) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error("Error en getMe:", error);
        res.status(500).json(error)
    }
}

const updateProfile = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user?.id_usuario || req.user?.id || req.user?.userId;
        const { name, email, dni, especialidad, matricula, obra_social, numero_afiliado, telefono } = req.body;

        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.update({ name, email, dni }, { transaction: t });

        if (user.role === 'medico') {
            const medico = await Medico.findOne({ where: { id_usuario: userId }, transaction: t });
            if (medico) {
                await medico.update({ especialidad, matricula }, { transaction: t });
            }
        } else if (user.role === 'paciente') {
            const paciente = await Paciente.findOne({ where: { id_usuario: userId }, transaction: t });
            if (paciente) {
                await paciente.update({ obra_social, numero_afiliado, telefono }, { transaction: t });
            }
        }

        await t.commit();
        res.json({ message: 'Perfil actualizado con éxito' });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error al actualizar: ' + error.message });
    }
};
const passwordValida = (password) => typeof password === 'string' && password.length >= 8

const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body

        if (passwordActual === undefined || passwordNueva === undefined) {
            return res.status(400).json({ message: "Debe completar todos los campos obligatorios." })
        }

        if (!passwordValida(passwordNueva)) {
            return res.status(400).json({ message: "La contraseña nueva debe tener al menos 8 caracteres." })
        }

        const user = await User.findByPk(req.user.id_usuario)

        if (user === null) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        const coincide = await bcrypt.compare(passwordActual, user.password)
        if (!coincide) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta." })
        }

        const esLaMisma = await bcrypt.compare(passwordNueva, user.password)
        if (esLaMisma) {
            return res.status(400).json({ message: "La contraseña nueva debe ser distinta a la actual." })
        }

        user.password = await bcrypt.hash(passwordNueva, 11)
        sellarUsuario(user)
        await user.save()

        await registrarBitacora(user.id_usuario, "CAMBIAR_PASSWORD", {})

        res.status(200).json({ message: "Contraseña actualizada con éxito." })
    } catch (error) {
        res.status(500).json(error)
    }
}
const eliminarCuenta = async (req, res) => {
    const t = await sequelize.transaction()

    try {
        const userId = req.user.id_usuario
        const { password } = req.body

        if (!password) {
            await t.rollback()
            return res.status(400).json({ message: "Debe ingresar su contraseña para confirmar." })
        }

        const user = await User.findByPk(userId, { transaction: t })

        if (!user) {
            await t.rollback()
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        const coincide = await bcrypt.compare(password, user.password)
        if (!coincide) {
            await t.rollback()
            return res.status(401).json({ message: "La contraseña es incorrecta." })
        }

        // No dejar el sistema sin ningún administrador
        if (user.role === 'admin') {
            const cantidadAdmins = await User.count({ where: { role: 'admin' }, transaction: t })
            if (cantidadAdmins <= 1) {
                await t.rollback()
                return res.status(409).json({ message: "Sos el único administrador: asigná otro antes de eliminar tu cuenta." })
            }
        }

        // Turnos pagados vigentes: hay que cancelarlos primero 
        const hoy = new Date().toISOString().split('T')[0]
        const pagadosVigentes = await Turno.count({
            where: { id_paciente: userId, estado: 'Pagado', fecha: { [Op.gte]: hoy } },
            transaction: t
        })

        if (pagadosVigentes > 0) {
            await t.rollback()
            return res.status(409).json({ message: "Tenés turnos pagados vigentes. Cancelalos antes de eliminar tu cuenta." })
        }

        // Los turnos reservados sin pagar vuelven a estar disponibles
        await Turno.update(
            { estado: 'Disponible', id_paciente: 0, dvh: null, dvv: null },
            { where: { id_paciente: userId, estado: 'Reservado' }, transaction: t }
        )

        // Se limpian los vínculos médico-paciente donde participaba
        if (user.role === 'medico') {
            await Medico.destroy({
                where: { id_usuario: userId },
                transaction: t
            });
        } else if (user.role === 'paciente') {
            await User.destroy({
                where: { id_usuario: userId },
                transaction: t
            });
        }

        await user.destroy({ transaction: t })
        await t.commit()

        await registrarBitacora(userId, "ELIMINAR_CUENTA", { email: user.email })

        res.status(200).json({ message: "Tu cuenta fue eliminada correctamente." })
    } catch (error) {
        if (!t.finished) await t.rollback()
        res.status(500).json(error)
    }
}
const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Debe ingresar su correo." })
        }

        // Misma respuesta exista o no el correo: así no se puede averiguar quién está registrado
        const respuesta = {
            message: "Si el correo está registrado, vas a recibir un enlace para restablecer tu contraseña."
        }

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(200).json(respuesta)
        }

        const token = crypto.randomBytes(32).toString('hex')

        // Se guarda el HASH del token, no el token en sí
        user.resetToken = crypto.createHash('sha256').update(token).digest('hex')
        user.resetExpira = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
        await user.save()

        const enlace = `http://localhost:5173/reset-password/${token}`

        // Simulación del envío de correo
        console.log(`[RECUPERACIÓN] Enlace para ${email}: ${enlace}`)

        await registrarBitacora(user.id_usuario, "SOLICITAR_RECUPERACION_PASSWORD", {})

        // Solo en desarrollo, para poder probar sin servidor de correo
        if (process.env.NODE_ENV !== 'production') {
            respuesta.enlaceDemo = enlace
        }

        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json(error)
    }
}
const resetearPassword = async (req, res) => {
    try {
        const { token, passwordNueva } = req.body

        if (!token || !passwordValida(passwordNueva)) {
            return res.status(400).json({ message: "Datos inválidos: la contraseña debe tener al menos 8 caracteres." })
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            where: {
                resetToken: tokenHash,
                resetExpira: { [Op.gt]: new Date() }
            }
        })

        if (!user) {
            return res.status(400).json({ message: "El enlace es inválido o ya venció. Solicitá uno nuevo." })
        }

        user.password = await bcrypt.hash(passwordNueva, 11)
        user.resetToken = null      // el enlace queda de un solo uso
        user.resetExpira = null
        sellarUsuario(user)
        await user.save()

        await registrarBitacora(user.id_usuario, "RESTABLECER_PASSWORD", {})

        res.status(200).json({ message: "Contraseña restablecida. Ya podés iniciar sesión." })
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    userRegister,
    userLogin,
    getMe,
    updateProfile,
    passwordValida,
    cambiarPassword,
    eliminarCuenta,
    recuperarPassword,
    resetearPassword
}