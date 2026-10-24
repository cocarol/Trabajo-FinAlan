const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.js');


const Notificacion = sequelize.define('Notificacion' ,{
    id_notificacion: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        allowNull: false
    },
    fecha_notificacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_notificacion: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    estado_notificacion: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    mensaje_notificacion: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
})


module.exports = Notificacion;