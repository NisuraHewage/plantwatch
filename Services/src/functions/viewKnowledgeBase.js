'use strict';


var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

var docClient =  new AWS.DynamoDB.DocumentClient();

async function knowledgeView(knowledgeId){

  // Check if device exists in middleware

  var params = {
    TableName: "Knowledgebase",
    Key:{
        "KnowledgeId": knowledgeId
    }
  };
  
try{
  var result = await docClient.get(params).promise();

  return {
    statusCode: 200,
    body:JSON.stringify({
      item: result
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


module.exports.viewKnowledgeBase = async (event, context) => {
  
  return await knowledgeView(event.queryStringParameters.knowledgeId);
};
