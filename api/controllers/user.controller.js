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
            id_usuario: userCreated.id_usuario,
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
            { id_usuario: searchedUser.id_usuario, email: searchedUser.email, role: searchedUser.role },
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

const updateProfile = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id_usuario;
        const { name, email, dni, especialidad, matricula, obra_social, numero_afiliado, telefono } = req.body;

        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.update({ name, email, dni }, { transaction: t });

        if (user.role === 'medico') {
            const medico = await Medico.findOne({ where: { id_usuario: userId }, transaction: t });
            if (medico) {
                await medico.update({ especialidad, matricula }, { transaction: t });
            }
        } else if (user.role === 'paciente') {
            const paciente = await Paciente.findOne({ where: { id_usuario: userId }, transaction: t });
            if (paciente) {
                await paciente.update({ obra_social, numero_afiliado, telefono }, { transaction: t });
            }
        }

        await t.commit();
        res.json({ message: 'Perfil actualizado con éxito' });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error al actualizar: ' + error.message });
    }
};

module.exports = {
    userRegister,
    userLogin,
    getMe,
    updateProfile
}