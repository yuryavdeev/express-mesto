const { messageList } = require('../utils/utils');

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
  next();
};
