const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Administrador } = require('.');

const Administrador = sequelize.define('Administrador' ,{
    id_admin: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_admin: {
        type: Datatypes.STRING(25),
        allowNull: false,
    },
    apellido_admin: {
        type: Datatypes.STRING(25),
        allowNull: false
    },
    permisos_admin: {
        type: Datatypes.BOOLEAN,
        defaultValue: false
    },
    tel_admin: {
        type: Datatypes.INTEGER(10),
        allowNull: true
    }
})

module.exports = {Administrador};