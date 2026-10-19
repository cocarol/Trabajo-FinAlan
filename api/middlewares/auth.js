const jwt = require('jsonwebtoken')

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
const isMedico = (req, res, next) => {
    if (req.user.role !== 'medico') {
        return res.status(403).json({ message: "Acceso restringido a profesionales de la salud" })
    }
    next()
}

module.exports = {
    auth,
    isMedico
}