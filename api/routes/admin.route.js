const { Router } = require("express")
const { auth, isAdmin } = require('../middlewares/auth')
const { listarUsuarios, cambiarRol, verificarIntegridad } = require('../controllers/admin.controller')

const router = Router()

router.get('/usuarios', auth, isAdmin, listarUsuarios)
router.put('/usuarios/:id/rol', auth, isAdmin, cambiarRol)
router.get('/integridad', auth, isAdmin, verificarIntegridad)

module.exports = router