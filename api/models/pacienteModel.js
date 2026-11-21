const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Paciente = sequelize.define('Paciente', {
    id_paciente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_medico: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    obra_social: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    numero_afiliado: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    dvh: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dvv: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "pacientes",
    timestamps: false
});

module.exports = Paciente;