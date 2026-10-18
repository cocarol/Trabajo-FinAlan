const { auth } = require('../middlewares/auth')
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

module.exports = router