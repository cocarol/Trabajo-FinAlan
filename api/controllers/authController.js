const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Filipenses 4:7'

const registrar = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            username,
            password: passwordEncriptada
        });

        res.status(201).json({ message: "Usuario creado con éxito", id: nuevoUsuario.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const usuario = await Usuario.findOne({ where: { username } });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '2h' });

        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registrar, login };