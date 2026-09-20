const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db')

const Medico = sequelize.define('Medico' ,{
    id_: {
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

module.exports = {Medico};