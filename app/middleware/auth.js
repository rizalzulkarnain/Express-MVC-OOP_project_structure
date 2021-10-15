const jwt = require('jsonwebtoken');
const UnauthenticatedException = require('../exceptions/unauthenticated-exception');
const { appKey } = require('../../config/app');

exports.auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const UserRepository = require('../repositories/user-repository');

  if (!token) {
    return next(
      new UnauthenticatedException('You need to be authenticated.... !')
    );
  }

  await jwt.verify(token, appKey, async (err, user) => {
    if (err) {
      return next(
        new UnauthenticatedException(
          'You need to be authenticated, Invalid Token !'
        )
      );
    }

    try {
      const authUser = await UserRepository.findByEmail(user.email);
      req.user = authUser;

      next();
    } catch (err) {
      return res.status(err.status || 401).send({ message: 'User not found!' });
    }
  });
};
