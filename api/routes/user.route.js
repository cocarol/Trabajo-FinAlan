const { Router } = require("express")
const { auth } = require('../middlewares/auth')
const { userRegister, userLogin, getMe, updateProfile } = require("../controllers/user.controller")

const router = Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/me', auth, getMe)
router.put('/profile' ,updateProfile);

module.exports = router