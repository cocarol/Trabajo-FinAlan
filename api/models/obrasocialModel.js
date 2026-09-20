const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db')

const ObraSocial = sequelize.define('Obra_Social' ,{
    id_obrasocial: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_obrasocial: {
        type: Datatypes.STRING(30),
        allowNull: false,
    },
    telefono_obrasocial: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    plan_obrasocial: {
        type: Datatypes.STRING(20),
        defaultValue: false
    }
})

module.exports = {ObraSocial}