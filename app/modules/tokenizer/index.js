const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const appConfig = require('../../../config/app');

class Tokenizer {
  constructor(appConfig) {
    this.config = appConfig;
  }

  generateAccessToken(user) {
    return jwt.sign(user, this.config.appKey, {
      expiresIn: this.config.tokenExpiresIn,
    });
  }

  generateRefreshToken(length = 40) {
    return crypto.randomBytes(length).toString('hex');
  }
}

module.exports = new Tokenizer(appConfig);
