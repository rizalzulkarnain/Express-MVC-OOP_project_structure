const express = require('express');
const Router = require('../router');
const Scheduler = require('../app/scheduler');
const WebSocket = require('../socket');
const http = require('http');
const hbs = require('express-handlebars');

class Server {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.router = Router;
    this.server = http.createServer(this.app);
  }

  start() {
    this._setViewEngine();
    this._setupRoutes();
    this._startScheduler();
    this._openWebSocket();
    this._listen();
  }

  _openWebSocket() {
    const ws = new WebSocket(this.server);
    ws.startListening();
  }

  _startScheduler() {
    Scheduler.runTasks();
  }

  _setViewEngine() {
    this.app.engine(
      'hbs',
      hbs({
        extname: '.hbs',
      })
    );

    this.app.set('view engine', 'hbs');
  }

  _setupRoutes() {
    this.router.create(this.app);
  }

  _listen() {
    this.server.listen(this.port, () => {
      console.log(`Server Running Port: ${this.port}`);
    });
  }
}

module.exports = Server;
