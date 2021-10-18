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

  generateRandomToken(length = 40) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateRefreshToken(length = 40) {
    return this.generateRandomToken(length);
  }
}

module.exports = new Tokenizer(appConfig);
