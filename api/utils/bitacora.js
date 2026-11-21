const { Bitacora } = require('../models/index')

const registrarBitacora = async (usuarioId, accion, detalle = {}) => {
    try {
        await Bitacora.create({
            id_usuario: usuarioId,
            usuarioId,
            accion,
            evento_registrado: `${accion}: ${JSON.stringify(detalle)}`,
            detalle: typeof detalle === 'string' ? detalle : JSON.stringify(detalle),
            fecha_registrada: new Date().toISOString().split('T')[0],
            hora_registrada: new Date().toTimeString().split(' ')[0]
        })
    } catch (error) {
        console.log("Error al registrar bitácora:", error.message)
    }
}

module.exports = { registrarBitacora }