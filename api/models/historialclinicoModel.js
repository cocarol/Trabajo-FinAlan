const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const HistorialClinico = sequelize.define('HistorialClinico' ,{
    id_historial: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    fecha_historialclinico: {
        type: Datatypes.DATE,
        allowNull: false
    },
    peso_historialclinico: {
        type: Datatypes.DOUBLE,
        allowNull: false
    },
    altura_historialclinico: {
        type: Datatypes.DOUBLE,
        allowNull: false
    },
    observacion_historialclinico: {
        type: Datatypes.STRING(100),
        allowNull: false
    }
})


module.exports = {HistorialClinico};