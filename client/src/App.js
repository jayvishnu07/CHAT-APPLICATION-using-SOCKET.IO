import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import Chat from './Components/Chat';

const socket = io.connect('http://localhost:8080')


function App() {

  const [name, setName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [showChat, setShowChat] = useState(false)
  const joinRoom = () => {
    if(name !== "" && roomId !== "" ){
      setShowChat(true);
      socket.emit('join-chat',{name ,roomId});
      socket.emit('notify-other-user',{name ,roomId});
    }
  }
 

  return (
    <div className="App">
      {
        showChat ?
          (<Chat socket={socket} name={name} roomId={roomId} />)
          :
          (
            <div className="join-container-div">
              <h2>Chat Application</h2>
              <input type="text" placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
              <input type="text" placeholder='Room' onChange={(e) => { setRoomId(e.target.value) }} />
              <button onClick={joinRoom} > Join Room </button>
            </div>
          )
      }
    </div>
  );
}

export default App;
