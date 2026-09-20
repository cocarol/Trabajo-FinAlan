const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Disponibilidad = sequelize.define('Disponibilidad' ,{
    id_disponibilidad: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    horainicio_disponibilidad: {
        type: Datatypes.TIME,
        allowNull: false
    },
    horafin_disponibilidad: {
        type: Datatypes.TIME,
        allowNull: false
    },
    fecha_disponibilidad: {
        type: Datatypes.DATE,
        allowNull: false
    }
})


module.exports = {Disponibilidad};