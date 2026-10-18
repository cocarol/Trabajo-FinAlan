const { Router } = require("express")
const { auth } = require('../middlewares/auth')
const { crearTurno } = require('../controllers/turno.controller')

const {
    cancelarTurno,
    buscarTurnosDisponibles,
    reservarTurno,
    pagarConsulta,
    misTurnos
} = require('../controllers/turno.controller')

const router = Router()

router.get('/disponibles', auth, buscarTurnosDisponibles)
router.post('/reservar', auth, reservarTurno)
router.delete('/:turnoId/cancelar', auth, cancelarTurno)
router.post('/pagar', auth, pagarConsulta)
router.get('/mis-turnos', auth, misTurnos)
router.post('/crear', auth, crearTurno)

module.exports = router