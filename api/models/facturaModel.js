const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Factura = sequelize.define('Factura' ,{
    id_factura: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    numero_factura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaemision_factura: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_factura: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
})


module.exports = Factura;