const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Filipenses 4:7';

const verificarSesion = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(403).json({ message: "No enviaste un token." });
        }

        const token = authHeader.split(' ')[1];

        const decodificado = jwt.verify(token, SECRET_KEY);

        req.usuarioId = decodificado.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

module.exports = { verificarSesion };