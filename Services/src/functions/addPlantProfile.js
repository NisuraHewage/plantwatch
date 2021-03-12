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
const { compareSync } = require('bcryptjs');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

async function profileCreate(plantName, scientificName, imageUrl, event){
  try {
      await sequelize.authenticate();

     // Check if profile exists

      const exitingProfiles = await PlantProfile.findAll({
        where:{Name: plantName}
      });

      if(exitingProfiles.length != 0){
        return {
          statusCode: 400,
          body:{
            message: "Plant profile of same name already exists"
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }

      const newProfile = await PlantProfile.create({ Name: plantName, ScientificName: scientificName, ImageUrl: imageUrl });

      await sequelize.close();
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: {
          created: newProfile.Id
        }
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

async function uploadToS3(file){

  var base64data = Buffer.from(file.content, 'binary');
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.DYNAMO_DB_SECRETKEY,
    region: 'us-east-1'
  });
  const params = {
    Bucket: process.env.STORAGE_BUCKET,
    Key: Date.now().toString() + file.filename,
    Body: base64data,
    ContentType: file.contentType,
    ACL: 'public-read'
  };

  s3bucket.upload(params, async (err, data) => {
    try {
      if (err) {
        console.log(err);
        return {
          statusCode: 400,
          body:{
            data
          }
        }
       } else {
         console.log(data);
         return data.Location;
     }
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        body:{
          data
        }
      }
    }
  });
}

module.exports.addPlantProfile = async (event, context) => {
  //const body = JSON.parse(event.body);
  const formData = parse(event);
   const createdImageUrl = await uploadToS3(formData.myFile);
   console.log(createdImageUrl);
   console.log(formData.name)
 // await profileCreate( body.name, body.scientificName, createdImageUrl ,event);
};
