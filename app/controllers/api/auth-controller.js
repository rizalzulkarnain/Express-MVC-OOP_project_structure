const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { appKey, tokenExpiresIn } = require('../../../config/app');
const InvalidCredentialException = require('../../exception/invalid-credential-exception');

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new InvalidCredentialException('Invalid Login Credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new InvalidCredentialException('Invalid Login Credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const accessToken = jwt.sign(payload, appKey, {
      expiresIn: tokenExpiresIn,
    });
    // const key = require('crypto').randomBytes(64).toString('hex');

    res.send({ user, ...{ accessToken } });
  }

  async register(req, res) {
    res.send('register');
  }
}

module.exports = new AuthController();
