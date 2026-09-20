const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Factura = sequelize.define('Factura' ,{
    id_factura: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    numero_factura: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    fechaemision_factura: {
        type: Datatypes.DATE,
        allowNull: false
    },
    total_factura: {
        type: Datatypes.DOUBLE,
        allowNull: false
    }
})


module.exports = {Factura};