const fs = require('fs');
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAY7RTYKCBDL3VWK5G",
    secretAccessKey: "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"
});

async function uploadToS3(){
    const fileContent = fs.readFileSync('test-db.js');
   //var base64data = Buffer.from(file.content, 'binary');
    let s3bucket = new AWS.S3({
      accessKeyId: "AKIAY7RTYKCBDL3VWK5G",
      secretAccessKey: "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",
      region: 'us-east-1'
    });
    const params = {
      Bucket: 'ogservice-sysadmin-serverlessdeploymentbucket-15i8y3iz32o9y',
      Key: Date.now().toString(),
      Body: fileContent,
      ACL: 'public-read'
    };
  
    try{
      var data = await new AWS.S3().upload(params).promise();
      console.log(data);
    }catch(err){
      console.log(err);
    }
    
  }

uploadToS3().then(() => {

})