'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

const Plants = require('../models/Plants');
const Plant = Plants(sequelize, DataTypes);

const Parameters = require('../models/Parameters');
const Parameter = Parameters(sequelize, DataTypes);

async function parametersUpsert(plantProfileId, parameters, event){
  try {
      await sequelize.authenticate();

     // Check if profile exists

     const exitingDevices = await PlantProfile.findAll({
      where:{Id: plantProfileId}
    });

    if(exitingDevices.length == 0){
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "This profile does not exists"
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
    }

    // Get all parameters related to profile

    let existingParameters = await Parameter.findAll({
      where: {PlantProfileID: plantProfileId}
    });

    // loop through parameters if they exist in the incoming parameters update the values. If not create them. if they are not present on incoming delete

    for(let i =0; i < existingParameters.length; i++){
        let existingParam = existingParameters[i];
        if(parameters.filter(p => p.Id == existingParam.Id).length == 0){
          await existingParam.destroy();
        }
    }

    for(let i =0; i < parameters.length; i++){
      let param = parameters[i];
      let existingParams = existingParameters.filter(p => p.Id == param.Id);
      if(existingParams.length > 0){
        existingParams[0].UpperLimit = param.UpperLimit;
        existingParams[0].LowerLimit = param.LowerLimit;
        existingParams[0].Message = param.Message;
        existingParams[0].Action = param.Action;
        await existingParams[0].save();
      }else{
        const createdParam = await Parameter.create({PlantProfileID: plantProfileId, Name: param.Name, UpperLimit: param.UpperLimit, 
          LowerLimit: param.LowerLimit, Message: param.Message, Action: param.Action});
      }
    }
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          message: "Successfully updated parameters"
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

// Parameter { Name, UpperLimit, LowerLimit, Message, Action  }
module.exports.upsertParameters = async (event, context) => {
  const body = JSON.parse(event.body);
  console.log(body);
  // parameters is an array of Parameter
  const { parameters, plantProfileId } = body;
  return await parametersUpsert(plantProfileId, parameters ,event);
};
