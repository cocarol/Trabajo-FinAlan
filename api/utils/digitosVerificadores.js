const crypto = require('crypto')

// DVH: hash de los campos de ESTA fila (detecta si alguien la modificó por fuera del sistema)
const calcularDVH = (datosFila) => {
    const contenido = JSON.stringify(datosFila)
    return crypto.createHash('sha256').update(contenido).digest('hex').substring(0, 16)
}

// DVV: encadena el DVH de esta fila con el DVV de la fila anterior (detecta filas borradas/insertadas)
const calcularDVV = (dvhActual, dvvAnterior = "") => {
    const contenido = dvhActual + dvvAnterior
    return crypto.createHash('sha256').update(contenido).digest('hex').substring(0, 16)
}

module.exports = { calcularDVH, calcularDVV }