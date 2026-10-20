const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const MetodoPago = sequelize.define('MetodoPago' ,{
    id_diagnostico: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    descripcion_diagnostico: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    fecha_diagnostico: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
})


module.exports = MetodoPago;