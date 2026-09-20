const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Bitacora = sequelize.define('Bitacora' ,{
    cod_bitacora: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    evento_registrado: {
        type: Datatypes.STRING(50),
        allowNull: false
    },
    fecha_registrada: {
        type: Datatypes.DATE,
        allowNull: false
    },
    hora_registrada: {
        type: Datatypes.TIME,
        allowNull: false
    }
})


module.exports = {Bitacora};