const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")

const Bitacora = sequelize.define("Bitacora", {
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detalle: {
        type: DataTypes.JSON,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "bitacora",
    timestamps: false
})

module.exports = {Bitacora};