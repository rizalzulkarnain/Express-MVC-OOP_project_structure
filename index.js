const Server = require('./server');

const port = process.env.PORT || 5000;

const app = new Server(port);
app.start();
