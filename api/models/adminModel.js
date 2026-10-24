const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Administrador = sequelize.define('Administrador', {
    id_admin: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_admin: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    apellido_admin: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    permisos_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tel_admin: {
        type: DataTypes.INTEGER(10),
        allowNull: true
    }
})

module.exports = Administrador