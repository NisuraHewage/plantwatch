'use strict';

const { parse } = require('aws-multipart-parser');

const { v4: uuidv4 } = require('uuid');

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

var docClient =  new AWS.DynamoDB.DocumentClient();

async function knowledgeCreate(plantProfileId, title, content){

  // Check if device exists in middleware

  var params = {
    TableName:"Knowledgebase",
    Item:{
      "KnowledgeId": uuidv4(),
        "ProfileId": plantProfileId,
        "Title": title,
        "Content": content
    }
};

try{
  var result = await docClient.put(params).promise();
  console.log("Added item:", result);

  return {
    statusCode: 201,
    body:JSON.stringify({
      message: "Added Reading",
      created: result.ReadingId
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Authorization'
    }
  }
}catch(err){
  console.error("Unable to add item. Error JSON:", err);
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


module.exports.addKnowledgeBase = async (event, context) => {
  const body = JSON.parse(event.parse);
  return await knowledgeCreate(body.plantProfileId, body.title, body.content);
};
