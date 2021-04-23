var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAY7RTYKCBDL3VWK5G",
    secretAccessKey: "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"
});

var dynamodb = new AWS.DynamoDB();

var docClient =  new AWS.DynamoDB.DocumentClient();


async function Do(){

    var params = {
        TableName:"Readings",
        Item:{
            "ReadingId": "4546489491578",
            "DeviceId": 1,
            "UserId": 1,
            "Timestamp": Date.now(),
            "Moisture": 255,
            "Temperature": '533',
            "Light": 533,
            "Humidity": 53333
        }
    };
    

console.log("Adding a new item...");
try{
        var result = await docClient.put(params).promise()
            
        console.log("Added item:" + JSON.stringify(result));
}catch(e){
    console.error("Unable to add item. Error JSON:", e);
}

/* var params = {
    TableName : "Readings",
    KeyConditionExpression: "#dId = :device",
    ExpressionAttributeNames:{
        "#dId": "DeviceId"
    },
    ExpressionAttributeValues: {
        ":device": 1
    }
};

try{
    var result = await docClient.scan({TableName:"Readings"}).promise();
    console.log(result.Items.filter(d => d.DeviceId == 1).sort((a,b) => b.Timestamp - a.Timestamp ));
    
}catch(err){
    console.log(JSON.stringify(err))
} */

    return;

params = {
    TableName : "Readings",
    KeySchema: [       
        { AttributeName: "ReadingId", KeyType: "HASH"},  //Partition key
        { AttributeName: "DeviceId", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "ReadingId", AttributeType: "S" },
        { AttributeName: "DeviceId", AttributeType: "N" },
       /*  { AttributeName: "Moisture", AttributeType: "N" },
        { AttributeName: "Temperature", AttributeType: "N" },
        { AttributeName: "Light", AttributeType: "N" },
        { AttributeName: "", AttributeType: "N" },
        { AttributeName: "Timestamp", AttributeType: "N" }, */
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
    
});

params = {
    TableName : "Notifications",
    KeySchema: [       
        { AttributeName: "NotificationId", KeyType: "HASH"},  //Partition key
        { AttributeName: "Timestamp", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "NotificationId", AttributeType: "S" },
        /* { AttributeName: "Message", AttributeType: "S" },
        { AttributeName: "Action", AttributeType: "S" },
        { AttributeName: "IsRead", AttributeType: "B" }, */
        { AttributeName: "Timestamp", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
    
});

params = {
    TableName : "DiseaseIdentificationResults",
    KeySchema: [       
        { AttributeName: "DiseaseIdentificationResultId", KeyType: "HASH"},  //Partition key
        { AttributeName: "Timestamp", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "DiseaseIdentificationResultId", AttributeType: "S" },
       /*  { AttributeName: "PlantId", AttributeType: "N" },
        { AttributeName: "AttemptedImageURL", AttributeType: "S" },
        { AttributeName: "Result", AttributeType: "N" }, */
        { AttributeName: "Timestamp", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
    
});

}

Do().then(()=> {});