const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('examen3b', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});
//hola
module.exports = {
    sequelize
}