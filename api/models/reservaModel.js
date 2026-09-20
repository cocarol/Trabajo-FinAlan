const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Reserva = sequelize.define('Reserva' ,{
    nro_reserva: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    horario_reserva: {
        type: Datatypes.TIME,
        allowNull: false
    },
    especialidad_reserva: {
        type: Datatypes.STRING(30),
        allowNull: false
    },
    fecha_reserva: {
        type: Datatypes.DATE,
        allowNull: false
    }
})


module.exports = {Reserva};