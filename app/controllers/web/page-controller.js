const logger = require('../../modules/logger');

class PageController {
  async home(req, res) {
    // res.send('Home Page');

    logger.info('Info Message');

    res.render('home');
  }

  async product(req, res) {
    // res.send('Product Page');
    res.render('product');
  }

  async about(req, res) {
    // res.send('About Page');
    res.render('about');
  }
}

module.exports = new PageController();
