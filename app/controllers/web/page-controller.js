class PageController {
  home(req, res) {
    res.send('Home Page');
  }

  product(req, res) {
    res.send('Product Page');
  }

  about(req, res) {
    res.send('About Page');
  }
}

module.exports = new PageController();
