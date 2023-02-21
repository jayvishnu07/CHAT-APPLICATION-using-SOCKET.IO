const express = require('express')
const app = express()
const http = require('http')
const s = require('socket.io')
const cors = require('cors')
const { FormatWelcomeMessage, FormatNotificationMessage ,FormatExitMessage} = require('./SubComponent/FormatMessage')
app.use(express.json())

app.use(cors());
server = http.createServer(app);

const io = new s.Server(server, {
    cors: 'http://localhost:3000'
})

let user_names_array=[];                                                                                                                                         


//initiating connection
io.on('connection', (socket) => {
    //Joining the room
    socket.on('join-chat', (data) => {
        socket.join(data.roomId)
        socket.name = data.name;
        let user_names_object = {name : data.name, roomId : data.roomId}
        user_names_array.push(user_names_object);
        console.log("user_names_array ",user_names_array);
        //greetings
        socket.emit('message', FormatWelcomeMessage(data, `Hi ${data.name} 🖐️ Welcome to the ${data.roomId} room...!`))
    })

    //Notifying other users
    socket.on('notify-other-user', (data) => {
        socket.to(data.roomId).emit('message', FormatNotificationMessage(data, `"${data.name}" joined the chat`));
    })

    socket.on('send_message', (data) => {
        socket.to(data.roomId).emit('message', data);
    })
    //user disconnected
    socket.on('disconnect', () => {
        user_names_array = user_names_array.filter((prev)=>prev.name != socket.name)
        console.log("users = >",user_names_array);
        io.emit('message', FormatExitMessage(socket, `"${socket.name}" left the chat...!`))
    })

})

app.get('/get-users',(req,res)=>{
    res.json(user_names_array)
})

server.listen('8080', () => { console.log("server started...") })