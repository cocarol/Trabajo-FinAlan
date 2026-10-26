const { Router } = require("express")
const { auth } = require('../middlewares/auth')
const { userRegister, userLogin, getMe, updateProfile } = require("../controllers/user.controller")
const { cambiarPassword, eliminarCuenta, recuperarPassword, resetearPassword } = require("../controllers/user.controller")
const router = Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/me', auth, getMe)
router.put('/perfil', auth, updateProfile)
router.post('/recuperar', recuperarPassword)
router.post('/reset-password', resetearPassword)
router.put('/cambiar-password', auth, cambiarPassword)
router.delete('/me', auth, eliminarCuenta)

module.exports = router