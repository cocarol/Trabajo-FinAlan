const { Sequelize } = require('sequelize');//pene cocaro 

const sequelize = new Sequelize('TurnoSalud', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = {
    sequelize
}