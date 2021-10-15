// const nodemailer = require('nodemailer');
const mailConfig = require('../../../config/mail');
const InvalidCredentialException = require('../../exceptions/invalid-credential-exception');
const UserRepository = require('../../repositories/user-repository');
const AuthService = require('../../services/auth-service');
const Mail = require('../../modules/mailer');

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserRepository.findByEmail(email);

    if (!(await AuthService.isPasswordAMatch(password, user.password))) {
      throw new InvalidCredentialException('Invalid Login Credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    // const key = require('crypto').randomBytes(64).toString('hex');
    const tokens = await AuthService.generateTokens(payload);

    res.send(this._parsedResponse(user, tokens));
  }

  async register(req, res) {
    const { firstName, lastName, email, password } = req.body;

    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    await Mail.send('email-verification', (message) => {
      message
        .from(mailConfig.form)
        .to(email)
        .subject('Email Verification')
        .with({
          firstName,
          lastName,
          email,
        });
    });

    res.send(parsedResponse(user, tokens));
  }

  _parsedResponse(user, tokens) {
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }
}

const parsedResponse = (user, tokens) => {
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    ...tokens,
  };
};

module.exports = new AuthController();
