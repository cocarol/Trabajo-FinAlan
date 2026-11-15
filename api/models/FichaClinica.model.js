const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FichaClinica = sequelize.define('FichaClinica', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medicoId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    peso: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    altura: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    presion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dvh: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dvv: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'fichas_clinicas',
    timestamps: false
});

module.exports = FichaClinica;