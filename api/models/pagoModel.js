const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Pago = sequelize.define('Pago' ,{
    id_pago: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false
    },
    monto_pago: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado_pago: {
        type: DataTypes.STRING(12),
        allowNull: false
    }
})


module.exports = {Pago};