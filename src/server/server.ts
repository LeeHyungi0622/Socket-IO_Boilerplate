import { createServer } from 'http'
import { Server } from 'socket.io'
import * as express from 'express'
import * as path from 'path'

const clients: { [id: string]: any } = {}

const port = 3000

const app = express()
app.use(express.static(path.join(__dirname, '../client')))

const server = createServer(app)

const io = new Server(server)

io.on('connection', (socket) => {
  clients[socket.id] = {}
  socket.emit('id', socket.id)

  socket.on('disconnect', () => {
    if (clients && clients[socket.id]) {
      delete clients[socket.id]
      io.emit('removeClient', socket.id)
    }
  })

  socket.on('update', (message) => {
    if (clients[socket.id]) {
      clients[socket.id] = message // relaying the complete message
    }
  })
})

setInterval(() => {
  io.emit('clients', clients)
}, 100)

server.listen(port, () => {
  console.log('Server listening on port ' + port)
})
