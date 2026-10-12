const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (name === null || email === null || password === null) {
            return res.status(400).json({ message: "Faltan campos obligatorios" })
        }

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "Ya existe un usuario con ese email" })
        }

        const hashedPassword = await bcrypt.hash(password, 11)

        const userCreated = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            id: userCreated.id,
            name: userCreated.name,
            email: userCreated.email
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const searchedUser = await User.findOne({ where: { email } })

        if (!searchedUser) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" })
        }

        const match = await bcrypt.compare(password, searchedUser.password)

        if (!match) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" })
        }

        const token = await jwt.sign(
            { id: searchedUser.id, email: searchedUser.email },
            'misecreto',
            { expiresIn: '1h' }
        )

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json(error)
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        })

        if (user === null) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    userRegister,
    userLogin,
    getMe
}