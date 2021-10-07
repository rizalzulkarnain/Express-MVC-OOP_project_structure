const InvalidCredentialException = require('../../exceptions/invalid-credential-exception');
const UserRepository = require('../../repositories/user-repository');
const AuthService = require('../../services/auth-service');

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await UserRepository.findByEmail(email);

    // if (!user) {
    //   throw new InvalidCredentialException('Invalid Login Credentials');
    // }

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
    const accessToken = await AuthService.generateToken(payload);

    res.send({ user, ...{ accessToken } });
  }

  async register(req, res) {
    res.send('register');
  }
}

module.exports = new AuthController();
