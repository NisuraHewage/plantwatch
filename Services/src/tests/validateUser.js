'use strict';

// tests for validateUser

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('validateUser', '\\src\\functions\\validateUser.js', 'validateUser');

// Mocking AWS Services
const AWS = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS.setSDKInstance(AWS_SDK);

describe('validateUser', () => {
  before((done) => {
    done();
  });

});
