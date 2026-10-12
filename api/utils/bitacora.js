const { Bitacora } = require('../models/index')

const registrarBitacora = async (usuarioId, accion, detalle = {}) => {
    try {
        await Bitacora.create({
            usuarioId,
            accion,
            detalle
        })
    } catch (error) {
        console.log("Error al registrar bitácora:", error)
    }
}

module.exports = { registrarBitacora }