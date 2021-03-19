'use strict';

// tests for updateProfile

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('updateProfile', '../../../src/functions/updateProfile.js', 'updateProfile');

// Mocking AWS Services
const AWS = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS.setSDKInstance(AWS_SDK);

describe('updateProfile', () => {
  before((done) => {
    done();
  });

  it('implement tests here', async () => {
    const response = await wrapped.run({});
    expect(response).to.not.be.empty;
  });
});
