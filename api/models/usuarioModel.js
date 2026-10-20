const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db')

const Usuario = sequelize.define('Usuario' ,{
    id_usuario: {
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

module.exports = {Usuario};