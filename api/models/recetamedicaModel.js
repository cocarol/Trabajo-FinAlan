const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const RecetaMedica = sequelize.define('RecetaMedica' ,{
    id_receta: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    medicamentos_receta: {
        type: Datatypes.STRING(100),
        allowNull: false
    },
    indicaciones_receta: {
        type: Datatypes.STRING(150),
        allowNull: false
    },
    fecha_receta: {
        type: Datatypes.DATE,
        allowNull: false
    }
})


module.exports = {RecetaMedica};