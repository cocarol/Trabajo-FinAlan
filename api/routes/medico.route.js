const { Router } = require("express")
const { auth, isMedico } = require('../middlewares/auth')
const {
    listarPacientesDelDia,
    actualizarFichaClinica,
    verFichaClinica,
    vincularPaciente
} = require('../controllers/medico.controller')

const router = Router()

router.get('/pacientes-del-dia', auth, isMedico, listarPacientesDelDia)
router.post('/ficha-clinica', auth, isMedico, actualizarFichaClinica)
router.get('/ficha-clinica/:id_paciente', auth, isMedico, verFichaClinica)
router.post('/vincular-paciente', auth, isMedico, vincularPaciente)

module.exports = router