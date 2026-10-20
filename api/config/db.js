const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('examen3b', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = {
    sequelize
}