const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const MetodoPago = sequelize.define('MetodoPago' ,{
    id_diagnostico: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    descripcion_diagnostico: {
        type: Datatypes.STRING(20),
        allowNull: false
    },
    fecha_diagnostico: {
        type: Datatypes.STRING(50),
        allowNull: false
    }
})


module.exports = {MetodoPago};