const { Router } = require("express")
const { auth } = require('../middlewares/auth')
const { obtenerEspecialidades, obtenerObrasSociales} = require("../controllers/catalogo.controller")

const router = Router()

router.get('/especialidades', obtenerEspecialidades)
router.get('/obrasocial', obtenerObrasSociales)

module.exports = router