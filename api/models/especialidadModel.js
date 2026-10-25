const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Especialidad = sequelize.define('Especialidad' ,{
    id_especialidad: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_especialidad: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    descripcion_especialidad: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: "especialidades",
    timestamps: false
})

module.exports = Especialidad;