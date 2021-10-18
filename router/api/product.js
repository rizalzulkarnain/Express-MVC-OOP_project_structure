const ProductController = require('../../app/controllers/api/product-controller');
const { auth } = require('../../app/middleware/auth');
const { formData } = require('../../app/middleware/formData');

module.exports = {
  group: {
    prefix: '/products',
    middleware: [auth],
  },
  routes: [
    {
      method: 'get',
      path: '/',
      handler: ProductController.index,
    },
    {
      method: 'post',
      path: '/',
      middleware: [formData],
      handler: ProductController.create,
    },
  ],
};
