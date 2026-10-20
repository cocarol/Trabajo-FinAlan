const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');

const Consultorio = sequelize.define('Consultorio', {
    id_consultorio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    numero_consultorio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    piso_consultorio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado_consultorio: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

module.exports = { Consultorio };