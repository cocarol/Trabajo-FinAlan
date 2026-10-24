const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Reserva = sequelize.define('Reserva' ,{
    nro_reserva: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    horario_reserva: {
        type: DataTypes.TIME,
        allowNull: false
    },
    especialidad_reserva: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false
    }
})


module.exports = Reserva