const jwt = require('jsonwebtoken')
const { User } = require('../models/index')

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']

        if (authHeader === undefined) {
            return res.status(401).json({ message: "No se proporcionó un token" })
        }

        const token = authHeader.split(' ')[1]

        const decode = await jwt.verify(token, 'misecreto')

        req.user = decode

        next()
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" })
    }
}
const requireRole = (...rolesPermitidos) => async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id_usuario, { attributes: ['id_usuario', 'role'] })

        if (!user || !rolesPermitidos.includes(user.role)) {
            return res.status(403).json({ message: "No cuenta con los permisos necesarios para esta acción" })
        }

        req.user.role = user.role
        next()
    } catch (error) {
        res.status(500).json(error)
    }
}

const isMedico = requireRole('medico')
const isAdmin = requireRole('admin')

module.exports = {
    auth,
    isMedico,
    isAdmin
}