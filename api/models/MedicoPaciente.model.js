const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MedicoPaciente = sequelize.define('MedicoPaciente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    medicoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tableName: 'medico_paciente',
    timestamps: false
});

module.exports = MedicoPaciente;