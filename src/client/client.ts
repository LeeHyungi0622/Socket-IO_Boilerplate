import { io } from 'socket.io-client'

const socket = io()

let joined = false

socket.on('connect', () => {
  const uName = prompt('What is your name?') // as string
  if (uName) {
    socket.emit('joining', uName)
  }
})

socket.on('disconnect', (message) => {
  alert('Disconnected from Server \nReason : ' + message)
})

socket.on('message', (message) => {
  if (joined) {
    document.body.innerHTML += '<p>' + message + '</p>'
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
})

socket.on('joined', (message) => {
  document.body.innerHTML = '<p>' + message + '</p>'
  joined = true
})
