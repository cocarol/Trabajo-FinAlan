const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")

const Turno = sequelize.define("Turno", {
    pacienteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Disponible" 
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null
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
    tableName: "turnos",
    timestamps: false
})

module.exports = Turno