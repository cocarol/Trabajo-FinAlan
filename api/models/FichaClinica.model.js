const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")

const FichaClinica = sequelize.define("FichaClinica", {
    pacienteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medicoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    peso: {
        type: DataTypes.STRING, // cifrado
        allowNull: true
    },
    altura: {
        type: DataTypes.STRING, // cifrado
        allowNull: true
    },
    presion: {
        type: DataTypes.STRING, // cifrado
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT, // cifrado
        allowNull: true
    },
    dvh: { type: DataTypes.STRING, allowNull: true },
    dvv: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: "fichas_clinicas",
    timestamps: false
})

module.exports = FichaClinica