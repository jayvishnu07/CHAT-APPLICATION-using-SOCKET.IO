const express = require('express')
const app = express()
const http = require('http')
const s = require('socket.io')
const cors = require('cors')
const FormatMessage  = require('./SubComponent/FormatMessage')

app.use(cors());
server = http.createServer(app);

const io = new s.Server(server,{
    cors : 'http://localhost:3000'
})

//initiating connection
io.on('connection', (socket)=>{
    //Joining the room
    socket.on('join-chat',(data)=>{
            socket.join(data.roomId)
            socket.name = data.name;
            //greetings
            socket.emit('message',FormatMessage(data,"Welcome to the Chat...!"))
    })
    
    //Notifying other users
    socket.on('notify-other-user',(data)=>{
        socket.to(data.roomId).emit('message', FormatMessage(data,`${data.name} joined the chat`));
    })

    socket.on('send_message',(data)=>{
        socket.to(data.roomId).emit('message',data);
    })
    //user disconnected
    socket.on('disconnect',()=>{
        io.emit('message',FormatMessage(socket,`${socket.name} left the chat...!`))
    })

})

server.listen('8080',()=>{console.log("server started...")})