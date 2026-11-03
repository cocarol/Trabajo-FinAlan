const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario_ObraSocial = sequelize.define('Usuario_ObraSocial', {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users', // Must match the tableName of the User model exactly
            key: 'id_usuario'
        }
    },
    id_obrasocial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Obra_Socials', // Must match the tableName of the ObraSocial model exactly
            key: 'id_obrasocial'
        }
    }
}, {
    tableName: "Usuario_ObraSocial",
    timestamps: false
});

module.exports = Usuario_ObraSocial;