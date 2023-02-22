import './App.css';
import io from 'socket.io-client'
import { useState  } from 'react';
import Chat from './Components/Chat';

//web.archieve.org

let socket;
function App() {

  const [name, setName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [showChat, setShowChat] = useState(false)


  const connectAndJoinRoom = () => {
    if (name !== "" && roomId !== "") {
      // here is the link to server... this link should refer the server
      // socket = io.connect('http://192.168.9.193:8080')
      // socket = io.connect('http://localhost:8080')
      socket = io.connect('http://localhost:8080')
      socket.emit('join-chat', { name, roomId });
      setShowChat(true);
      socket.emit('notify-other-user', { name, roomId });
    }
  }

  return (
    <div className="App">
      {
        showChat ?
          (<Chat socket={socket} name={name} roomId={roomId} setShowChat={setShowChat} />)
          :
          (
            <div className="join-container-div">
              <h2>Chat Application</h2>
              <input type="text" placeholder='Name' onChange={(e) => { setName(e.target.value) }} onKeyDown={(e) => { e.key === "Enter" && connectAndJoinRoom() }} />
              <input type="text" placeholder='Room' onChange={(e) => { setRoomId(e.target.value) }} onKeyDown={(e) => { e.key === "Enter" && connectAndJoinRoom() }} />
              <button onClick={connectAndJoinRoom}  > Join Room </button>
            </div>
          )
      }
    </div>
  );
}

export default App;
