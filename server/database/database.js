const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://tefcgnwolfmmpw:45e15f139ead8843352cf12a1ea8f2301a7d5416a46ba4d3ae69a76820cf50e7@ec2-54-163-227-202.compute-1.amazonaws.com:5432/d7j7d6uq7s2kdf', {
   dialect: 'postgres',
   dialectOptions: {
       ssl: {
           require: true
       }
   }
});

module.exports = sequelize;