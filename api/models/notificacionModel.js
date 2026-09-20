const { Datatypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Notificacion = sequelize.define('Notificacion' ,{
    id_notificacion: {
        type: Datatypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    fecha_notificacion: {
        type: Datatypes.DATE,
        allowNull: false
    },
    tipo_notificacion: {
        type: Datatypes.STRING(20),
        allowNull: false
    },
    estado_notificacion: {
        type: Datatypes.STRING(12),
        allowNull: false
    },
    mensaje_notificacion: {
        type: Datatypes.STRING(100),
        allowNull: false
    }
})


module.exports = {Notificacion};