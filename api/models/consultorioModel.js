const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Consultorio = sequelize.define('Consultorio' ,{
    id_consultorio: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    numero_consultorio: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    piso_consultorio: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    estado_consultorio: {
        type: Datatypes.BOOLEAN,
        allowNull: false
    }
})


module.exports = {Consultorio};