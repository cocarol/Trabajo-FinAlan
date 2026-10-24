const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');
//pene

const RecetaMedica = sequelize.define('RecetaMedica' ,{
    id_receta: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    medicamentos_receta: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    indicaciones_receta: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    fecha_receta: {
        type: DataTypes.DATE,
        allowNull: false
    }
})


module.exports = {RecetaMedica};