const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db')

const ObraSocial = sequelize.define('Obra_Social' ,{
    id_ubicacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    direccion_ubicacion: {
        type: Datatypes.STRING(40),
        allowNull: false,
    },
    cuidad_ubicacion: {
        type: Datatypes.STRING(25),
        allowNull: false
    },
    provincia_ubicacion: {
        type: Datatypes.STRING(25),
        defaultValue: false
    },
    codigopostal: {
        type: Datatypes.INTEGER,
        allowNull: false
    }
})

module.exports = {ObraSocial}