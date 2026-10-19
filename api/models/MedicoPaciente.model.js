const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")

const MedicoPaciente = sequelize.define("MedicoPaciente", {
    medicoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pacienteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dvh: { type: DataTypes.STRING, allowNull: true },
    dvv: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: "medico_paciente",
    timestamps: false
})

module.exports = MedicoPaciente