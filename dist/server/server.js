"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express = require("express");
const path = require("path");
const luckyNumbersGame_1 = require("./luckyNumbersGame");
const port = 3000;
const app = express();
console.log(`경로 : ${path.join(__dirname)}`);
app.use(express.static(path.join(__dirname, '../client')));
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const game = new luckyNumbersGame_1.default();
let clientCount = 0;
io.on('connection', (socket) => {
    clientCount++;
    console.log('a user connected : ' + socket.id);
    console.log(clientCount);
    const someObject = { name: 'ABC', age: 123 };
    game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 20);
    socket.emit('message', 'Hello, your lucky number is ' + game.LuckyNumbers[socket.id]);
    socket.emit('message', `Hello ${socket.id}`);
    socket.broadcast.emit('message', 'Everybody, say hello to ' + socket.id);
    socket.on('disconnect', () => {
        clientCount--;
        console.log(`socket disconnected : ${socket.id}`);
        console.log(clientCount);
        socket.broadcast.emit('message', socket.id + 'has left the building');
    });
});
io;
server.listen(port, () => {
    console.log('Server listening on Port ' + port);
});
// 모든 소켓에 메시지 브로드케스팅
// 서버레벨에서 모든 접속한 클라이언트들한테 메시지 뿌리기
setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 20);
    const winners = game.GetWinners(randomNumber);
    if (winners.length) {
        winners.forEach((w) => {
            io.to(w).emit('message', '*** You are the winner with ' + randomNumber + ' ***');
        });
    }
    io.emit('message', randomNumber);
}, 1000);
