const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Diagnostico = sequelize.define('Diagnostico' ,{
    id_diagnostico: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    descripcion_diagnostico: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_diagnostico: {
        type: DataTypes.DATE,
        allowNull: false
    }
})


module.exports = {Diagnostico};