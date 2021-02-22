
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'nishad',
  applicationName: 'my-fullstack-app',
  appUid: 'Tcdn6bvgvGhBQg2Zlc',
  orgUid: '9b5650f0-3b37-4577-985b-679b166a1f1a',
  deploymentUid: '37d3caab-5b1d-4cbe-af69-53f6f0830fa8',
  serviceName: 'serverless',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '4.4.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'serverless-dev-createUser', timeout: 6 };

try {
  const userHandler = require('./src/functions/createUser.js');
  module.exports.handler = serverlessSDK.handler(userHandler.createUser, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}