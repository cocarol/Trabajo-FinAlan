const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Pago = sequelize.define('Pago' ,{
    id_pago: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    fecha_pago: {
        type: Datatypes.DATE,
        allowNull: false
    },
    monto_pago: {
        type: Datatypes.DOUBLE,
        allowNull: false
    },
    metodo_pago: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    estado_pago: {
        type: Datatypes.STRING(12),
        allowNull: false
    }
})


module.exports = {Pago};