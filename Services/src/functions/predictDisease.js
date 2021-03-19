'use strict';

module.exports.predictDisease = async (event, context) => {

  // Upload to S3

  // Go through ML

  // Store result in Dynamo

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
};
