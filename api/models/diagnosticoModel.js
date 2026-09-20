const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Diagnostico = sequelize.define('Diagnostico' ,{
    id_diagnostico: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    descripcion_diagnostico: {
        type: Datatypes.STRING(100),
        allowNull: false
    },
    fecha_diagnostico: {
        type: Datatypes.DATE,
        allowNull: false
    }
})


module.exports = {Diagnostico};