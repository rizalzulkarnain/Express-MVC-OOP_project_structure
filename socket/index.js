const ws = require('ws');
const jwt = require('jsonwebtoken');
const Tokenizer = require('../app/modules/tokenizer');
const { appKey } = require('../config/app');

const sockets = new Map();
const users = new Map();

class WebSocket {
  constructor(server) {
    this.server = server;
    this.ws = new ws.Server({ noServer: true });

    this._ping();
    this._handleUpgrade();
  }

  _ping() {
    setInterval(() => {
      console.log('clients: ', this.ws.clients.size);

      for (const client of this.ws.clients) {
        if (client.isAlive === false) {
          return client.terminate();
        }

        client.isAlive = false;
        client.ping();
      }
    }, 2000);
  }

  _handleUpgrade() {
    this.server.on('upgrade', async (request, socket, head) => {
      const id = Tokenizer.generateRandomToken();

      const token = request.headers['sec-websocket-protocol'];

      if (token) {
        await jwt.verify(token, appKey, (err, user) => {
          if (err) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            return socket.destroy();
          }

          this.ws.handleUpgrade(request, socket, head, (socket) => {
            socket.id = id;

            if (users.has(user.id)) {
              const existingUser = users.get(user.id);
              existingUser.sockets = [...existingUser.socket, ...[socket]];
              sockets.set(id, user.id);
            } else {
              users.set(user.id, {
                id: user.id,
                firstName: user.firstName,
                sockets: [socket],
              });
              sockets.set(id, user.id);
            }

            this.ws.emit('connection', socket);
          });
        });
      } else {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        return socket.destroy();
      }
    });
  }

  startListening() {
    this.ws.on('connection', (socket) => {
      const userJoined = user.get(sockets.get(socket.id));
      if (userJoined) {
        for (const socket of this.ws.clients) {
          if (client !== socket) {
            client.send(`User ${userJoined.firstName} joined!`);
          }
        }
      }

      socket.on('message', (message) => {
        for (const socket of this.ws.clients) {
          client.send(message);
        }
      });

      socket.on('pong', () => {
        console.log('Pong');
        socket.isAlive = true;
      });

      socket.on('close', () => {
        const user = users.get(sockets.get(socket.id));

        if (user.sockets.length > 1) {
          users.sockets = user.sockets.filter((sock) => {
            if (sock.id !== socket.id) return true;

            sockets.delete(socket.id);

            return false;
          });

          users.set(user.id, user);
        } else {
          sockets.delete(socket.id);
          users.delete(user.id);
        }
      });
    });
  }
}

module.exports = WebSocket;
