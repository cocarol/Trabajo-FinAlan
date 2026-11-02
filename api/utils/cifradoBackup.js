const crypto = require('crypto')

const CLAVE = crypto.scryptSync(process.env.BACKUP_KEY || 'clave-de-backup-demo', 'salt-backup', 32)

// Formato del archivo: [iv 12 bytes][tag 16 bytes][datos cifrados]
const cifrarBackup = (buffer) => {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', CLAVE, iv)
    const cifrado = Buffer.concat([cipher.update(buffer), cipher.final()])
    const tag = cipher.getAuthTag()
    return Buffer.concat([iv, tag, cifrado])
}

const descifrarBackup = (buffer) => {
    const iv = buffer.subarray(0, 12)
    const tag = buffer.subarray(12, 28)
    const datos = buffer.subarray(28)
    const decipher = crypto.createDecipheriv('aes-256-gcm', CLAVE, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(datos), decipher.final()])
}

module.exports = { cifrarBackup, descifrarBackup }