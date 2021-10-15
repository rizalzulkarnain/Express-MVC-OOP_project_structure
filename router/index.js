const express = require('express');
const webRoutes = require('./web');
const apiRoutes = require('./api');
const logger = require('../app/modules/logger');

class Router {
  constructor() {
    this.router = express.Router();
    this.webRoutes = webRoutes;
    this.apiRoutes = apiRoutes;
  }

  create(app) {
    //middleware
    this._attachMiddleware();

    //attach routes
    this._attachWebRoutes();
    this._attachApiRoutes();

    //handle 404 pages
    this._handlePageNotFound();

    //handle exceptions
    this._handleExceptions();

    //register router
    app.use(this.router);
  }

  _handleExceptions() {
    this.router.use((err, req, res, next) => {
      err.statusCode = err.status || err.statusCode || 500;

      logger.error(err.message);

      return res.status(err.statusCode).send(err.message);
    });
  }

  _catchError(route) {
    return (req, res, next) => {
      route(req, res, next).catch(next);
    };
  }

  _attachMiddleware() {
    this.router.use(express.json());
  }

  _handlePageNotFound() {
    this.router.all('*', (req, res) => {
      res.status(404).send('Page Not Found !');
    });
  }

  _attachWebRoutes() {
    this._attachRoutes(this.webRoutes);
  }

  _attachApiRoutes() {
    this._attachRoutes(this.apiRoutes, '/api');
  }

  _attachRoutes(routesGroups, prefix = '') {
    routesGroups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware = [], handler }) => {
        this.router[method](
          prefix + group.prefix + path,
          [...(group.middleware || []), ...middleware],
          this._catchError(handler)
        );
      });
    });
  }
}

module.exports = new Router(this.router);
