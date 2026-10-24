const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Disponibilidad = sequelize.define('Disponibilidad' ,{
    id_disponibilidad: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    horainicio_disponibilidad: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horafin_disponibilidad: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fecha_disponibilidad: {
        type: DataTypes.DATE,
        allowNull: false
    }
})


module.exports = Disponibilidad;