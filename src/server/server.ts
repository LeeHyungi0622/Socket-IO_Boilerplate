import { createServer } from 'http'
import { Server } from 'socket.io'
import * as express from 'express'
import * as path from 'path'
import LuckyNumbersGame from './luckyNumbersGame'

const port = 3000

const app = express()
app.use(express.static(path.join(__dirname, '../client')))

const server = createServer(app)

const io = new Server(server)

const game = new LuckyNumbersGame()

const players: { [id: string]: { luckyNumber: number; socketId: string } } = {}

io.on('connection', (socket) => {
  console.log('a user connected : ' + socket.id)

  socket.on('joining', (uName) => {
    if (players[uName]) {
      // existing player. Use the lucky number already registered
      players[uName].socketId = socket.id // update the reference since each new connection gets a new socket.id
      socket.emit(
        'joined',
        'Hello "' +
          uName +
          '", welcome back, your lucky number is ' +
          players[uName].luckyNumber
      )
    } else {
      // Create a new player with a new lucky number
      players[uName] = {
        luckyNumber: Math.floor(Math.random() * 20),
        socketId: socket.id
      }

      socket.emit(
        'joined',
        'Hello new player named "' +
          uName +
          '", your lucky number is ' +
          players[uName].luckyNumber
      )
    }

    game.LuckyNumbers[socket.id] = players[uName].luckyNumber

    socket.broadcast.emit('message', 'Everybody, say hello to "' + uName + '"')
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected : ' + socket.id)

    const player = Object.keys(players).find((p) => {
      return players[p].socketId === socket.id
    })
    if (player) {
      socket.broadcast.emit('message', 'Player "' + player + '" has left the building')
    }
  })
})

server.listen(port, () => {
  console.log('Server listening on port ' + port)
})

setInterval(() => {
  const randomNumber = Math.floor(Math.random() * 20)
  const winners = game.GetWinners(randomNumber)
  if (winners.length) {
    winners.forEach((w) => {
      io.to(w).emit('message', '*** You are the winner with ' + randomNumber + ' ***')
    })
  }
  io.emit('message', randomNumber)
}, 1000)
