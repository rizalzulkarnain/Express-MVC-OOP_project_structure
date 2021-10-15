const LogControllers = require('../../app/controllers/api/logControllers');
const { auth } = require('../../app/middleware/auth');

module.exports = {
  group: {
    prefix: '/logs',
    middleware: [auth],
  },
  routes: [
    {
      method: 'get',
      path: '/',
      handler: LogControllers.index,
    },
    {
      method: 'get',
      path: '/:date',
      handler: LogControllers.show,
    },
  ],
};
