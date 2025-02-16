"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express = require("express");
const path = require("path");
const clients = {};
const port = 3000;
const app = express();
app.use(express.static(path.join(__dirname, '../client')));
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    clients[socket.id] = {};
    socket.emit('id', socket.id);
    socket.on('disconnect', () => {
        if (clients && clients[socket.id]) {
            delete clients[socket.id];
            io.emit('removeClient', socket.id);
        }
    });
    socket.on('update', (message) => {
        if (clients[socket.id]) {
            clients[socket.id] = message; // relaying the complete message
        }
    });
});
setInterval(() => {
    io.emit('clients', clients);
}, 100);
server.listen(port, () => {
    console.log('Server listening on port ' + port);
});
