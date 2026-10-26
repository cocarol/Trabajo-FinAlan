const { calcularDVH, calcularDVV } = require('./digitosVerificadores')

const datosVerificables = (user) => ({
    id: user.id_usuario,
    email: user.email,
    role: user.role,
    password: user.password
})

// Recalcula DVH y DVV de la fila (CU16). Llamar justo antes del save()
const sellarUsuario = (user) => {
    user.dvh = calcularDVH(datosVerificables(user))
    user.dvv = calcularDVV(user.dvh, user.dvv || "")
}

// Si la fila nunca fue sellada (dvh null), se considera consistente
const usuarioEsConsistente = (user) => {
    if (!user.dvh) return true
    return calcularDVH(datosVerificables(user)) === user.dvh
}

module.exports = { sellarUsuario, usuarioEsConsistente }