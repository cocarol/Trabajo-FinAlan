let activo = false

const activar = () => { activo = true }
const desactivar = () => { activo = false }

// Mientras está activo, solo se permiten lecturas
const bloquearEscrituras = (req, res, next) => {
    const esLectura = ['GET', 'HEAD', 'OPTIONS'].includes(req.method)

    if (activo && !esLectura) {
        return res.status(503).json({ message: "El sistema está en mantenimiento. Intentá de nuevo en unos minutos." })
    }
    next()
}

module.exports = { activar, desactivar, bloquearEscrituras }