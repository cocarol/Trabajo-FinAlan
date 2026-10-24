const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Paciente = sequelize.define('Paciente', {
    id_paciente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id_usuario'
        }
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
    }
}, {
    tableName: "pacientes",
    timestamps: false
});

module.exports = Paciente;