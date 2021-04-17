'use strict';



var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

var docClient =  new AWS.DynamoDB.DocumentClient();

async function knowledgeDelete(plantProfileId, knowledgeId){

  // Check if device exists in middleware

  var params = {
    TableName: "Knowledgebase",
    Key:{
        "ProfileId": plantProfileId,
        "KnowledgeId": knowledgeId
    }
  };
  
try{
  var result = await docClient.delete(params).promise();
  console.log("Deleted item:", result);

  return {
    statusCode: 201,
    body:JSON.stringify({
      message: "Deleted knowledgebase",
      created: knowledgeDelete
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


module.exports.deleteKnowledgebase = async (event, context) => {
  const body = JSON.parse(event.body);
  return await knowledgeDelete(body.plantProfileId, body.knowledgeId );
};
