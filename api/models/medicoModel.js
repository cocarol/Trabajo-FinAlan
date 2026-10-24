const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db')

const Medico = sequelize.define('Medico' ,{
    id_medico: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    DNI_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nombre_usuario: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    edad_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado_usuario: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Medico;