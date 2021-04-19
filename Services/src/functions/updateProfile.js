'use strict';
const { Sequelize,Model,DataTypes } = require('sequelize');

const { parse } = require('aws-multipart-parser')

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

async function profileUpdate(plantName, scientificName, imageUrl, plantDescription, watering, temperature, sunlight, soil, pests, diseases, fertilizer){
  try {
      await sequelize.authenticate();

     // Check if profile exists

      const exitingProfiles = await PlantProfile.findAll({
        where:{Name: plantName}
      });

      if(exitingProfiles.length == 0){
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "This plant profile doesn't exist"
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }

      if(imageUrl != ""){
        exitingProfiles[0].ImageUrl = imageUrl;
      }
      exitingProfiles[0].PlantDescription = plantDescription;
      exitingProfiles[0].Watering = watering;
      exitingProfiles[0].Temperature = temperature;
      exitingProfiles[0].Sunlight = sunlight;
      exitingProfiles[0].Soil = soil;
      exitingProfiles[0].Pests = pests;
      exitingProfiles[0].Diseases = diseases;
      exitingProfiles[0].Fertilizer = fertilizer;

      await exitingProfiles[0].save();

      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          updateProfile: exitingProfiles[0].Id
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

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


async function uploadToS3(file){

  var base64data = Buffer.from(file.content, 'binary');

  const params = {
    Bucket: process.env.STORAGE_BUCKET,
    Key: Date.now().toString() + file.filename,
    Body: base64data,
    ContentType: file.contentType,
    ACL: 'public-read'
  };

  try{
    var data = await new AWS.S3().upload(params).promise();
    console.log(data);
    return data.Location;
  }catch(err){
    console.log(err);
    return null;
  }
  
}


module.exports.updateProfile = async (event, context) => {
  console.log(event);
  const formData = parse(event);
  let createdImageUrl = "";
  if(formData.profileImage){
    createdImageUrl = await uploadToS3(formData.profileImage);
    if(createdImageUrl == null){
     return {
       statusCode: 500,
       body:{
         data
       }
     }
    }
  }
  console.log(formData.pests);
  return await profileUpdate(formData.plantName, formData.scientificName, createdImageUrl, formData.plantDescription,
    formData.watering, formData.temperature, formData.sunlight, formData.soil, formData.pests, formData.diseases,
    formData.fertilizer );
};
