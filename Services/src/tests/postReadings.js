'use strict';

// tests for postReadings

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('postReadings', '\\src\\functions\\postReadings.js', 'postReadings');

//let getNotificationMessageWrapped = mochaPlugin.getWrapper('getNotificationMessage', '../../../src/functions/postReadings.js', 'getNotificationMessage');

const {getNotificationMessage} = require('../../src/functions/postReadings.js')

// Mocking AWS Services
const AWS = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS.setSDKInstance(AWS_SDK);

describe('postReadings', () => {
  before((done) => {
    done();
  });
  let today = new Date();

  it('No Construct notifications -- No parameters or readings.', async () => {
    let lastnReadings = [];
    let params = [];
    const message = getNotificationMessage(lastnReadings,params);
    expect(message).to.equal("");
  });

  it('No Construct notifications -- Value impoves over time .', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 1,
        "Moisture": 2,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 2,
        "Moisture": 15,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date().getTime() + 3,
      "Moisture": 16,
      "Temperature": 25,
      "Light": 26,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal("");
  });

  it('Constructs notifications -- Value declines over time .', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 1,
        "Moisture": 15,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 2,
        "Moisture": 8,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date().getTime() + 3,
      "Moisture": 8,
      "Temperature": 25,
      "Light": 26,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal(" Low Moisture | ");
  });

  it('Constructs notifications -- Value does not improve over time .', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 1,
        "Moisture": 2,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 2,
        "Moisture": 3,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date().getTime() + 3,
      "Moisture": 5,
      "Temperature": 25,
      "Light": 26,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal(" Low Moisture | ");
  });

  it('Constructs notifications -- Value declines over time .', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 1,
        "Moisture": 15,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 2,
        "Moisture": 8,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date().getTime() + 3,
      "Moisture": 8,
      "Temperature": 25,
      "Light": 26,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal(" Low Moisture | ");
  });

  it('Constructs notifications -- Multiple invalid parameters .', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 1,
        "Moisture": 2,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date().getTime() + 2,
        "Moisture": 3,
        "Temperature": 25,
        "Light": 5,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date().getTime() + 3,
      "Moisture": 5,
      "Temperature": 25,
      "Light": 6,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"},
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Light", Action: "Too Light!", Name: "Light"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal(" Low Moisture |  Low Light | ");
  });

  it('Constructs notifications -- Readings more than a day apart last reading invalid.', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date(today.getTime() - 8.64e+7 - 11),
        "Moisture": 2,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date(today.getTime() - 8.64e+7 - 10),
        "Moisture": 3,
        "Temperature": 25,
        "Light": 5,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date().getTime() + 1,
      "Moisture": 5,
      "Temperature": 25,
      "Light": 6,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"},
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Light", Action: "Too Light!", Name: "Light"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal(" Low Moisture |  Low Light | ");
  });

  it('No notifications -- No readings in last day.', async () => {
    let lastnReadings2 = [
      {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date(today.getTime() - 8.64e+7 - 11),
        "Moisture": 2,
        "Temperature": 25,
        "Light": 26,
        "Humidity": 28
    },
    {
        "ReadingId": 1,
        "DeviceId": 1,
        "UserId": 1,
        "Timestamp": new Date(today.getTime() - 8.64e+7 - 10),
        "Moisture": 3,
        "Temperature": 25,
        "Light": 5,
        "Humidity": 28
    },
    {
      "ReadingId": 1,
      "DeviceId": 1,
      "UserId": 1,
      "Timestamp": new Date(today.getTime() - 8.64e+7 - 9),
      "Moisture": 5,
      "Temperature": 25,
      "Light": 6,
      "Humidity": 28
  }
    ];
    let params2 = [
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Moisture", Action: "Too Wet!", Name: "Moisture"},
      {UpperLimit: 20, LowerLimit: 10, Message: "Low Light", Action: "Too Light!", Name: "Light"}
    ];
    const message = getNotificationMessage(lastnReadings2.sort((a,b) => a.Timestamp - b.Timestamp ),params2);
    console.log(message);
    expect(message).to.equal("");
  });
});
