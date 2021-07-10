'use strict';

// tests for loginUser

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('loginUser', '\\src\\functions\\loginUser.js', 'loginUser');

// Mocking AWS Services
const AWS = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS.setSDKInstance(AWS_SDK);

describe('loginUser', () => {
  before((done) => {
    done();
  });

});
