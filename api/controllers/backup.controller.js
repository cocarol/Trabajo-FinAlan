const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { Transaction } = require('sequelize')
const { sequelize } = require('../config/db')
const { User, Turno, FichaClinica, MedicoPaciente, Bitacora } = require('../models/index')
const { registrarBitacora } = require('../utils/bitacora')
const { usuarioEsConsistente } = require('../utils/integridadUsuario')
const { cifrarBackup, descifrarBackup } = require('../utils/cifradoBackup')
const mantenimiento = require('../middlewares/mantenimiento')

const CARPETA = path.join(__dirname, '..', 'backups')   // "servidor externo" simulado
const MAX_INTENTOS = 3
const NOMBRE_VALIDO = /^backup-[0-9A-Za-z-]+\.enc$/

const TABLAS = {
    users: User,
    turnos: Turno,
    fichas_clinicas: FichaClinica,
    medico_paciente: MedicoPaciente,
    bitacora: Bitacora
}

class ErrorNegocio extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

const manejarError = (res, error) => {
    if (error instanceof ErrorNegocio) {
        return res.status(error.status).json({ message: error.message })
    }
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
}

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex')

// Reintenta hasta 3 veces (F2 del CU14 y F3 del CU17)
const conReintentos = async (accion) => {
    let ultimoError
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        try {
            return await accion()
        } catch (error) {
            ultimoError = error
        }
    }
    throw ultimoError
}

// ---------- CU14: lógica del backup ----------
const generarBackup = async (adminId) => {
    mantenimiento.activar()                                   // paso B

    try {
        fs.mkdirSync(CARPETA, { recursive: true })

        // Paso C: foto consistente de todas las tablas
        const t = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ })
        const datos = {}

        try {
            for (const [nombre, modelo] of Object.entries(TABLAS)) {
                datos[nombre] = await modelo.findAll({ raw: true, transaction: t })
            }
            await t.commit()
        } catch (error) {
            if (!t.finished) await t.rollback()
            throw error
        }

        // F3: no respaldar datos que ya estaban alterados
        const corruptos = datos.users.filter(u => !usuarioEsConsistente(u))
        if (corruptos.length > 0) {
            await registrarBitacora(adminId, "ALERTA_BACKUP_INTEGRIDAD", {
                criticidad: "ALTA",
                usuariosAfectados: corruptos.map(u => u.id_usuario)
            })
            throw new ErrorNegocio(409, "Integridad de origen comprometida. No se puede generar la copia de seguridad.")
        }

        // Paso D: empaquetar y cifrar
        const contenido = Buffer.from(JSON.stringify({ version: 1, fecha: new Date().toISOString(), datos }), 'utf8')
        const cifrado = cifrarBackup(contenido)

        // F1: espacio insuficiente en el destino
        const disco = await fs.promises.statfs(CARPETA)
        const libre = disco.bavail * disco.bsize
        if (libre < cifrado.length * 2) {
            throw new ErrorNegocio(507, "Espacio insuficiente en el disco de destino. Backup cancelado.")
        }

        // Paso E: transferir al almacenamiento secundario (con 3 reintentos, F2)
        const marca = new Date().toISOString().replace(/[:.]/g, '-')
        const archivo = `backup-${marca}.enc`
        const ruta = path.join(CARPETA, archivo)

        try {
            await conReintentos(() => fs.promises.writeFile(ruta, cifrado))
        } catch (error) {
            await fs.promises.rm(ruta, { force: true })       // purga el archivo temporal
            throw new ErrorNegocio(502, "Fallo en la comunicación con el servidor externo. Backup abortado.")
        }

        const meta = {
            archivo,
            fecha: new Date().toISOString(),
            tamano: cifrado.length,
            checksum: sha256(cifrado),
            registros: Object.fromEntries(Object.entries(datos).map(([nombre, filas]) => [nombre, filas.length])),
            creadoPor: adminId
        }

        await fs.promises.writeFile(path.join(CARPETA, archivo.replace('.enc', '.meta.json')), JSON.stringify(meta, null, 2))

        // Paso H: bitácora con fecha, tamaño y checksum
        await registrarBitacora(adminId, "BACKUP_REALIZADO", {
            archivo,
            tamano: meta.tamano,
            checksum: meta.checksum
        })

        return meta
    } finally {
        mantenimiento.desactivar()                            // paso F
    }
}

const crearBackup = async (req, res) => {
    try {
        const meta = await generarBackup(req.user.id)
        res.status(201).json({ message: "Backup realizado con éxito.", backup: meta })
    } catch (error) {
        manejarError(res, error)
    }
}

// ---------- CU17: pasos A-B (listar copias) ----------
const listarBackups = async (req, res) => {
    try {
        fs.mkdirSync(CARPETA, { recursive: true })

        const copias = fs.readdirSync(CARPETA)
            .filter(nombre => nombre.endsWith('.meta.json'))
            .map(nombre => JSON.parse(fs.readFileSync(path.join(CARPETA, nombre), 'utf8')))
            .sort((a, b) => b.fecha.localeCompare(a.fecha))

        // F1
        if (copias.length === 0) {
            return res.status(404).json({ message: "No hay copias de seguridad disponibles." })
        }

        res.status(200).json(copias)
    } catch (error) {
        manejarError(res, error)
    }
}

// ---------- CU17: restore ----------
const restaurarBackup = async (req, res) => {
    try {
        const adminId = req.user.id
        const { archivo, backupPrevio } = req.body

        // Solo nombres generados por el sistema (evita rutas tipo ../../algo)
        if (!archivo || !NOMBRE_VALIDO.test(archivo)) {
            throw new ErrorNegocio(400, "Nombre de copia inválido.")
        }

        const ruta = path.join(CARPETA, archivo)
        const rutaMeta = ruta.replace('.enc', '.meta.json')

        if (!fs.existsSync(ruta) || !fs.existsSync(rutaMeta)) {
            throw new ErrorNegocio(404, "La copia seleccionada no existe.")
        }

        // F5: backup del estado actual antes de reemplazarlo
        if (backupPrevio) {
            await generarBackup(adminId)
        }

        // Paso D: descargar (con 3 reintentos, F3)
        let cifrado
        try {
            cifrado = await conReintentos(() => fs.promises.readFile(ruta))
        } catch (error) {
            throw new ErrorNegocio(502, "No se pudo acceder al servidor de backup externo. Restore cancelado.")
        }

        // Paso F: integridad global del archivo (checksum)
        const meta = JSON.parse(await fs.promises.readFile(rutaMeta, 'utf8'))
        if (sha256(cifrado) !== meta.checksum) {
            throw new ErrorNegocio(422, "La copia de seguridad está corrupta. Se descartó el archivo.")
        }

        // Paso E: desencriptar (GCM también detecta alteraciones)
        let contenido
        try {
            contenido = JSON.parse(descifrarBackup(cifrado).toString('utf8'))
        } catch (error) {
            throw new ErrorNegocio(422, "La copia de seguridad está corrupta. Se descartó el archivo.")
        }

        // Pasos G-H-I: escritura exclusiva y reemplazo de datos
        mantenimiento.activar()

        try {
            const t = await sequelize.transaction()

            try {
                for (const modelo of Object.values(TABLAS)) {
                    await modelo.destroy({ where: {}, transaction: t })
                }

                for (const [nombre, modelo] of Object.entries(TABLAS)) {
                    const filas = contenido.datos[nombre] || []
                    if (filas.length > 0) {
                        await modelo.bulkCreate(filas, { transaction: t })
                    }
                }

                // Paso I: verificar los DVH de los datos restaurados
                const usuarios = await User.findAll({ raw: true, transaction: t })
                if (usuarios.some(u => !usuarioEsConsistente(u))) {
                    throw new ErrorNegocio(422, "La verificación de integridad de los datos restaurados falló. Se revirtieron los cambios.")
                }

                await t.commit()
            } catch (error) {
                // F4: no dejar la base a medio restaurar
                if (!t.finished) await t.rollback()
                throw error
            }
        } finally {
            mantenimiento.desactivar()                        // paso K
        }

        // Paso J
        await registrarBitacora(adminId, "RESTORE_REALIZADO", {
            archivo,
            checksum: meta.checksum,
            backupPrevio: !!backupPrevio
        })

        res.status(200).json({ message: "Restore completado con éxito.", restaurado: meta })
    } catch (error) {
        manejarError(res, error)
    }
}

module.exports = {
    crearBackup,
    listarBackups,
    restaurarBackup
}