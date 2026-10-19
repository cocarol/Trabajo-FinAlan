const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "paciente" // paciente | medico | admin
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    tableName: "users",
    timestamps: false
})

module.exports = {User}