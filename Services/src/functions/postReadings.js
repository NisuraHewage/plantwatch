'use strict';

module.exports.postReadings = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Testing branching process",
      input: event,
    }),
  };
};
