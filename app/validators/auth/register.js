const { body } = require('express-validator');

module.exports = (() => {
  return [
    body('firstName').notEmpty().withMessage("First Name can't be empty !"),
    body('lastName').notEmpty().withMessage("Last Name can't be empty !"),
    body('email').isEmail().withMessage('Email needs to be a valid address !'),
    body('password').notEmpty().withMessage("Password can't be empty !"),
  ];
})();
