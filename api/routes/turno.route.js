const { Router } = require("express")
const { auth } = require('../middlewares/auth')
const { crearTurno } = require('../controllers/turno.controller')

const {
    cancelarTurno,
    buscarTurnosDisponibles,
    reservarTurno,
    pagarConsulta,
    misTurnos,
    historialTurnos,
    confirmarTurno
} = require('../controllers/turno.controller')

const router = Router()

router.get('/disponibles', auth, buscarTurnosDisponibles)
router.post('/reservar', auth, reservarTurno)
router.delete('/:turnoId/cancelar', auth, cancelarTurno)
router.post('/pagar', auth, pagarConsulta)
router.get('/mis-turnos', auth, misTurnos)
router.post('/crear', auth, crearTurno)
router.get('/historial', auth, historialTurnos);
router.put('/:turnoId/confirmar', auth, confirmarTurno);

module.exports = router