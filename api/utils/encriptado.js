const crypto = require('crypto')

const ALGORITMO = 'aes-256-cbc'
const CLAVE = crypto.scryptSync('clave-secreta-del-sistema', 'salt-fijo', 32)

const encriptar = (textoPlano) => {
    if (textoPlano === null || textoPlano === undefined) return null
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITMO, CLAVE, iv)
    let encriptado = cipher.update(String(textoPlano), 'utf8', 'hex')
    encriptado += cipher.final('hex')
    return iv.toString('hex') + ':' + encriptado
}

const desencriptar = (textoCifrado) => {
    if (!textoCifrado) return null
    const [ivHex, datos] = textoCifrado.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITMO, CLAVE, iv)
    let desencriptado = decipher.update(datos, 'hex', 'utf8')
    desencriptado += decipher.final('utf8')
    return desencriptado
}

module.exports = { encriptar, desencriptar }