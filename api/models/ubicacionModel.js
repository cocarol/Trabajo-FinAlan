const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db')

const ObraSocial = sequelize.define('Obra_Social' ,{
    id_ubicacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    direccion_ubicacion: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    cuidad_ubicacion: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    provincia_ubicacion: {
        type: DataTypes.STRING(25),
        defaultValue: false
    },
    codigopostal: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = {ObraSocial}