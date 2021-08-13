const { messageList } = require('../utils/utils');

// eslint-disable-next-line no-unused-vars
module.exports.handleError = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? messageList.serverErrorMessage
        : message,
    });
};
