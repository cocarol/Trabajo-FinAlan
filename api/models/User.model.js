const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db")

const User = sequelize.define("User", {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
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
    },
    firmaRol: {
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
    },resetToken: {
    type: DataTypes.STRING,
    allowNull: true
    },
    resetExpira: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "users",
    timestamps: false
})

module.exports = User