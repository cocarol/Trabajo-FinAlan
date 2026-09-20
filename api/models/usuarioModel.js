const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db')

const Usuario = sequelize.define('Usuario' ,{
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    DNI_usuario: {
        type: Datatypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nombre_usuario: {
        type: Datatypes.STRING(40),
        allowNull: false
    },
    edad_usuario: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    estado_usuario: {
        type: Datatypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = {Usuario};