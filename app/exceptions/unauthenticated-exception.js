const BaseException = require('./base-exception');

class AuthenticatedException extends BaseException {
  constructor(message, status = 403) {
    super(message, status);
  }
}

module.exports = AuthenticatedException;
