const { NODE_ENV } = require("../config");
const logger = require("../logger/logger");

function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    logger.error(`Error Handler: ${error.message}`);
    response = { message: `Error Handler: ${error.message}`, error };
  }
  res.status(500).json(response);
}

module.exports = errorHandler;
