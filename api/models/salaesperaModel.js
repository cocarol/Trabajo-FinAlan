const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const SalaEspera = sequelize.define('SalaEspera' ,{
    id_sala: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    nombre_sala: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    capacidad_sala: {
        type: DataTypes.DATE,
        allowNull: false
    }
})


module.exports = {SalaEspera};