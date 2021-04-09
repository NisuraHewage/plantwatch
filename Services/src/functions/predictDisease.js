'use strict';

const https = require('https');
var AWS = require("aws-sdk");
const { parse } = require('aws-multipart-parser')

// Upload to S3
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

const identificationResultPromise = new Promise((res, rej) => {
  try{
    var data = "";
    var url = "http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict";
    data += "--" + boundary + "\r\n";
    data += "Content-Disposition: form-data; name=\"file\"; filename=\"" + upfile + "\"\r\n";
    data += "Content-Type:application/octet-stream\r\n\r\n";
    var payload = Buffer.concat([
      Buffer.from(file.content, 'binary')
    ]);
    var options = {
        method: 'post',
        url: url,
        headers: {"Content-Type": "multipart/form-data; boundary=" + boundary},
        body: payload,
    };
    request(options, function(error, response, body) {
      if(error){
        console.error("Error at identification request ", error);
        rej(error)
      }
      console.log(response);
      console.log(body);

    });
    
  }catch(err){
    console.error("Error at identification endpoint ", err);
    rej(err);
  }
})


// Go through ML
async function getIdentificationResult(file){

    // Check if device exists in middleware
    // http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict
    
    try{
      var data = "";
      var url = "http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict";
      data += "--" + boundary + "\r\n";
      data += "Content-Disposition: form-data; name=\"file\"; filename=\"" + upfile + "\"\r\n";
      data += "Content-Type:application/octet-stream\r\n\r\n";
      var payload = Buffer.concat([
        Buffer.from(file.content, 'binary')
      ]);
      var options = {
          method: 'post',
          url: url,
          headers: {"Content-Type": "multipart/form-data; boundary=" + boundary},
          body: payload,
      };
      request(options, function(error, response, body) {
        if(error){
          console.error("Error at identification request ", error);
        }
        console.log(body);
        console.log(response);
      });
      
    }catch(err){
      console.error("Error at identification endpoint ", err);
    }

}

 // Store result in Dynamo
 async function identificationResultCreate(userId, deviceId, moisture, temperature,  light, humidity, context){

  // Check if device exists in middleware

  var params = {
    TableName:"DiseaseIdentificationResults",
    Item:{
        "UserId": userId,
        "PlantId": userId,
        "Timestamp": Date.now(),
        "Result": moisture,
        "ImageUrl": temperature,
    }
};

console.log(params)
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

// image with multi-part form data to identify
// user id, plant id
module.exports.predictDisease = async (event, context) => {

  const formData = parse(event);
  await getIdentificationResult(formData.image);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
};
