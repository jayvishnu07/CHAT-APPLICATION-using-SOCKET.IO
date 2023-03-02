const express = require('express')
const app = express()
const http = require('http')
const s = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const { FormatWelcomeMessage, FormatNotificationMessage, FormatExitMessage } = require('./SubComponent/FormatMessage')

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/chat_application')
    .then(() => { console.log("Server connected to db...") })
    .catch((err) => console.log(err))
app.use(express.json())


app.use(cors());
server = http.createServer(app);

const io = new s.Server(server, {
    cors: 'http://localhost:3000'
})


//SCHEMA
const Messageschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 17
    },
    roomId: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

const usersschema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    }
})

//MODEL
const Chat = mongoose.model('Chat', Messageschema);
const Users = mongoose.model('User', usersschema);

//SOCKET.IO

//initiating connection
io.on('connection', (socket) => {
    //Joining the room
    socket.on('join-chat', (data) => {
        socket.join(data.roomId)
        socket.name = data.name;
        socket.roomId = data.roomId;
        let postObj = FormatWelcomeMessage(data, socket.id, `Hi ${data.name} 🖐️ Welcome to the ${data.roomId} room...!`);
        const createMessage = async () => {
            try {
                const chat = new Chat({
                    name: postObj.name,
                    roomId: postObj.roomId,
                    socketId: postObj.socketId,
                    message: postObj.message,
                    type: postObj.type,
                    time: postObj.time
                })
                const result = await chat.save();
                //emit result to client
                // console.log("from server", FormatNotificationMessage(data, socket.id, `"${data.name}" joined the chat`));
                // console.log("from db", result);
                socket.emit('message', result)
            } catch (error) {
                console.log("Error Occured in notification......", error.message);
            }
        }
        createMessage();
        //setting usernames in database       

        const createUsers = async (name, socket) => {
            try {
                const setUsers = new Users({
                    userName: name,
                    socketId: socket.id,
                    roomId: socket.roomId
                })
                await setUsers.save();
                const getUsers = await Users
                    .find()
                    .sort("name")
                    .select("userName socketId roomId")

                io.emit('get-users', getUsers);

            } catch (error) {
                console.log("Error Occured......", error.message);
            }
        }
        createUsers(data.name, socket);
    })

    //Notifying other users
    socket.on('notify-other-user', (data) => {
        let postObj = FormatNotificationMessage(data, socket.id, `"${data.name}" joined the chat`);
        const createMessage = async () => {
            try {
                const chat = new Chat({
                    name: postObj.name,
                    roomId: postObj.roomId,
                    socketId: postObj.socketId,
                    message: postObj.message,
                    type: postObj.type,
                    time: postObj.time
                })
                const result = await chat.save();
                //emit result to client
                // console.log("from server", FormatNotificationMessage(data, socket.id, `"${data.name}" joined the chat`));
                // console.log("from db", result);
                socket.to(result.roomId).emit('message', result)
            } catch (error) {
                console.log("Error Occured in notification......", error.message);
            }
        }
        createMessage();
    })

    socket.on('send_message', (data) => {
        const createMessage = async () => {
            try {
                const chat = new Chat({
                    name: data.name,
                    roomId: data.roomId,
                    socketId: data.socketId,
                    message: data.message,
                    type: data.type,
                    time: data.time
                })
                const result = await chat.save();
                //emit result to client
                // console.log("from server", data);
                // console.log("from db", result);
                socket.to(result.roomId).emit('message', result);

            } catch (error) {
                console.log("Error Occured in message ......", error.message);
            }
        }
        createMessage();
    })


    // get message while refresh
    socket.on("message-after-refresh", (data) => {

        console.log("data-----",data);

        const getMessages = async () => {
            try {
                const chat = await Chat
                    .find({ roomId: data.roomId})
                    .sort("time")
                console.log("messages == => ", chat);
                console.log(socket.id);

                socket.emit("get-message-after-refresh", chat)
            } catch (error) {
                console.log("Error Occured......\n", error.message);
            }
        }
        getMessages();
    })




    //user disconnected
    socket.on('disconnect', () => {
        // user_names_array = user_names_array.filter((prev) => prev.name != socket.name)
        let postObj = FormatExitMessage(socket, `"${socket.name}" left the chat...!`);
        const createMessage = async () => {
            try {
                const chat = new Chat({
                    name: postObj.name,
                    roomId: postObj.roomId,
                    socketId: postObj.socketId,
                    message: postObj.message,
                    type: postObj.type,
                    time: postObj.time
                })
                const result = await chat.save();
                //emit result to client
                // console.log("from server", FormatNotificationMessage(data, socket.id, `"${data.name}" joined the chat`));
                console.log("from db", result);
                io.emit('message', result)
                try {
                    console.log("result====", result);
                    console.log("result====", result._id);
                    const deleteditem = await Users.deleteOne({ socketId: result.socketId });
                    console.log(" deleted ===> ", deleteditem);
                    const getUsers = await Users
                        .find()
                        .sort("name")
                        .select("userName socketId roomId")
                    // console.log("Look here disconnect..........\n", getUsers);

                    io.emit('get-users', getUsers);
                } catch (error) {
                    console.log("Error Occured......\n", error.message);
                }


            } catch (error) {
                console.log("Error Occured in disconnect......", error.message);
            }
        }
        createMessage();
    })

})


//PORT number
const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server running on port ${port}`))