const PageControllers = require('../../app/controllers/web/page-controller');

module.exports = {
  group: {
    prefix: '/',
  },
  routes: [
    {
      method: 'get',
      path: '/',
      handler: PageControllers.home,
    },
    {
      method: 'get',
      path: 'product',
      handler: PageControllers.product,
    },
    {
      method: 'get',
      path: 'about',
      handler: PageControllers.about,
    },
  ],
};
