const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const HistorialClinico = sequelize.define('HistorialClinico' ,{
    id_historial: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    fecha_historialclinico: {
        type: DataTypes.DATE,
        allowNull: false
    },
    peso_historialclinico: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    altura_historialclinico: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    observacion_historialclinico: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
})


module.exports = HistorialClinico;