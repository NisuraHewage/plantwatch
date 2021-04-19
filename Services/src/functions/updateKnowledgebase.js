'use strict';


var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

var docClient =  new AWS.DynamoDB.DocumentClient();

async function knowledgeUpdate(knowledgeId, plantProfileId, title, content){

  // Check if device exists in middleware

  var params = {
    TableName:"Knowledgebase",
    Item:{
      "KnowledgeId": knowledgeId,
        "ProfileId": plantProfileId,
        "Title": title,
        "Content": content
    }
};

console.log(params)
try{
  var result = await docClient.put(params).promise();
  console.log("Updated item:", result);

  return {
    statusCode: 201,
    body:JSON.stringify({
      message: "Updated KnowldgeBase",
      created: result.ProfileId
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


module.exports.updateKnowledgebase = async (event, context) => {
  const body = JSON.parse(event.parse);
  return await knowledgeUpdate(body.knowledgeId, body.plantProfileId, body.title, body.content);
};
