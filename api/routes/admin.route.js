const { Router } = require("express")
const { auth, isAdmin } = require('../middlewares/auth')
const { listarUsuarios, cambiarRol, verificarIntegridad } = require('../controllers/admin.controller')
const { crearBackup, listarBackups, restaurarBackup } = require('../controllers/backup.controller')

const router = Router()

router.get('/usuarios', auth, isAdmin, listarUsuarios)
router.put('/usuarios/:id/rol', auth, isAdmin, cambiarRol)
router.get('/integridad', auth, isAdmin, verificarIntegridad)
router.post('/backup', auth, isAdmin, crearBackup)
router.get('/backups', auth, isAdmin, listarBackups)
router.post('/restore', auth, isAdmin, restaurarBackup)

module.exports = router