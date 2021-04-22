'use strict';

const https = require('https');
var AWS = require("aws-sdk");
/* const { parse } = require('aws-multipart-parser'); */
const { v4: uuidv4 } = require('uuid');

const request = require('request-promise');

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});
var docClient =  new AWS.DynamoDB.DocumentClient();

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
    console.log(data.Location)
    return data.Location;
  }catch(err){
    console.log(err);
    return null;
  }
}

const identificationResultPromise = (file) => new Promise(async (res, rej) => {
  try{
    var upfile = Date.now();
    var data = "";
    var url = "http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict";
    var boundary = "xxxxxxxxxx";
    data += "--" + boundary + "\r\n";
    data += "Content-Disposition: form-data; name=\"file\"; filename=\"" + upfile + "\"\r\n";
    data += "Content-Type:application/octet-stream\r\n\r\n";
    var payload = Buffer.concat([
      Buffer.from(data, "utf8"),
      Buffer.from(file.content, 'binary'),
      Buffer.from("\r\n--" + boundary + "--\r\n", "utf8")
    ]);
    var options = {
        method: 'post',
        url: url,
        headers: {"Content-Type": "multipart/form-data; boundary=" + boundary},
        body: payload,
    };

      var result = await request(options);
      console.log(result)
      res(result);
    
  }catch(err){
    console.error("Error at identification endpoint ", err);
    rej('');
  }
})

const requestPromise = require('request-promise');
// Go through ML
async function getIdentificationResult(userId, plantId, file, imageUrl){

    // Check if device exists in middleware
    // http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict
    
    try{
      var upfile = Date.now();
      var data = "";
      var url = "http://mlmodel-env.eba-rq8ips76.us-east-1.elasticbeanstalk.com/predict";
      var boundary = "xxxxxxxxxx";
      data += "--" + boundary + "\r\n";
      data += "Content-Disposition: form-data; name=\"file\"; filename=\"" + upfile + "\"\r\n";
      data += "Content-Type:application/octet-stream\r\n\r\n";
      var payload = Buffer.concat([
        Buffer.from(data, "utf8"),
        Buffer.from(file.content, 'binary'),
        Buffer.from("\r\n--" + boundary + "--\r\n", "utf8")
      ]);
      var options = {
          method: 'post',
          url: url,
          headers: {"Content-Type": "multipart/form-data; boundary=" + boundary},
          body: payload,
      };
      requestPromise(options).then(async (body) => {
        console.log("Logging body " + body);
        await identificationResultCreate(userId, plantId, response, imageUrl)
        return body;
      }).catch(err => {
        console.error(err);
        return "";
      });
      
    }catch(err){
      console.error("Error at identification endpoint ", err);
      return "";
    }
}

 // Store result in Dynamo
 async function identificationResultCreate(userId, plantId, result, imageUrl){

  // Check if device exists in middleware

  var params = {
    TableName:"DiseaseIdentificationResults",
    Item:{
        "DiseaseIdentificationResultId": uuidv4(),
        "UserId": userId,
        "PlantId": plantId,
        "Timestamp": Date.now(),
        "Result": result,
        "ImageUrl": imageUrl,
    }
};

console.log(params)
try{
  var result = await docClient.put(params).promise();
  console.log("Added item:", result);
  return {
    statusCode: 201,
    body:JSON.stringify({
      message: "Added item",
      created: result.DiseaseIdentificationResultId
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

Object.defineProperty(exports, "__esModule", { value: true });
function getValueIgnoringKeyCase(object, key) {
    var foundKey = Object.keys(object)
        .find(function (currentKey) { return currentKey.toLocaleLowerCase() === key.toLowerCase(); });
    return object[foundKey];
}
function getBoundary(event) {
    return getValueIgnoringKeyCase(event.headers, 'Content-Type').split('=')[1];
}
function getBody(event) {
    if (event.isBase64Encoded) {
        return Buffer.from(event.body, 'base64').toString('binary');
    }
    return event.body;
}
const parse = function (event, spotText) {
    var boundary = getBoundary(event);
    console.log(boundary);
    var result = {};
    var bodys = getBody(event);
      bodys.split(boundary)
        .forEach(function (item) {
        if (/filename=".+"/g.test(item)) {
            result[item.match(/name=".+";/g)[0].slice(6, -2)] = {
                type: 'file',
                filename: item.match(/filename=".+"/g)[0].slice(10, -1),
                contentType: item.match(/content-type:\s.+/g)[0].slice(14),
                content: spotText ? Buffer.from(item.slice(item.search(/content-type:\s.+/g) + item.match(/content-type:\s.+/g)[0].length + 4, -4), 'binary') :
                    item.slice(item.search(/content-type:\s.+/g) + item.match(/content-type:\s.+/g)[0].length + 4, -4),
            };
        }
        else if (/name=".+"/g.test(item)) {
            console.log("name matches")
            result[item.match(/name=".+"/g)[0].slice(6, -1)] = item.slice(item.search(/name=".+"/g) + item.match(/name=".+"/g)[0].length + 4, -4);
        }
    });
    return result;
};


// image with multi-part form data to identify
// user id, plant id
module.exports.predictDisease = async (event, context) => {
  let formData = parse(event);
  let imageUrl = await uploadToS3(formData.image);
 // const result = await getIdentificationResult(event.queryStringParameters.userId, event.queryStringParameters.plantId,formData.image, imageUrl);
  const result = await identificationResultPromise(formData.image);
  var result = event.queryStringParameters.result;
  await identificationResultCreate(event.queryStringParameters.userId, event.queryStringParameters.plantId, result, imageUrl);

  if(result == ''){
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Disease not identified',
      }),
    };
  }


  

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success',
      disease: result
    }),
  };
};
