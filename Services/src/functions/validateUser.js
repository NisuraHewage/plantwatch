'use strict';

const jwt = require('jsonwebtoken');

module.exports.validateUser = async (event, context) => {
  console.log(event.methodArn);
  const authorizerToken = event.authorizationToken
  const authorizerArr = authorizerToken.split(' ')
  const token = authorizerArr[1]

  if (authorizerArr.length !== 2 ||
  authorizerArr[0] !== 'Bearer' ||
  authorizerArr[1].length === 0) {
    
    return generatePolicy('undefined', 'Deny', event.methodArn)
  }
  let decodedJwt = jwt.verify(token, process.env.JWT_SECRET)
  if (typeof decodedJwt.email !== 'undefined' &&
  decodedJwt.email.length > 0) {
    console.log("Successfully verified");
    return generatePolicy(decodedJwt.email, 'Allow', event.methodArn)
  }
  generatePolicy('undefined', 'Deny', event.methodArn)
};

// Help function to generate an IAM policy
const generatePolicy = function(principalId, effect, resource) {
  let authResponse = {}

  authResponse.principalId = principalId
  if (effect && resource) {
    let policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    let statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  return authResponse
}