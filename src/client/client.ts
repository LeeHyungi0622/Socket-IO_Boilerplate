import { io } from 'socket.io-client'

const socket = io()

socket.on('connect', () => {
  document.body.innerText = `connected : ' + ${socket.id}`
})

// socket.on('gameover', (msg) => {
//   document.body.innerHTML += `<p>${msg}</p>`
// })

socket.on('message', function (msg) {
  console.log(msg)
  document.body.innerHTML += `<p>${msg} </p>`
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
})
