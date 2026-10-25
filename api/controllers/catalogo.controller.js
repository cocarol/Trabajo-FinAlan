const { Especialidad, ObraSocial } = require('../models/index');

const obtenerEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidad.findAll();
        res.status(200).json(especialidades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener especialidades", error });
    }
};

const obtenerObrasSociales = async (req, res) => {
    try {
        const obras = await ObraSocial.findAll();
        res.status(200).json(obras);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener obras sociales", error });
    }
};

module.exports = { obtenerEspecialidades, obtenerObrasSociales };