const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const SalaEspera = sequelize.define('SalaEspera' ,{
    id_sala: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    nombre_sala: {
        type: Datatypes.STRING(100),
        allowNull: false
    },
    capacidad_sala: {
        type: Datatypes.DATE,
        allowNull: false
    }
})


module.exports = {SalaEspera};