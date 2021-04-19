'use strict';


const { Sequelize,Model,DataTypes } = require('sequelize');
 
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Plants = require('../models/Plants');
const Plant = Plants(sequelize, DataTypes);

async function plantDelete(plantId, event){
  try {
      await sequelize.authenticate();

      const plants = await Plant.findAll({
        Id: plantId
      });

      await plants[0].destroy();

      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          message: "Successfully deleted"
        })
      };
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
    }
}

module.exports.deletePlant = async (event, context) => {
  const body = JSON.parse(event.body);
  return await plantDelete(body.plantId, event);
};
