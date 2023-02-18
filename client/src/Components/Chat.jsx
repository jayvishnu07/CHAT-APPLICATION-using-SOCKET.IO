import React, { useEffect, useState } from 'react'
import './/Chat.css'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';


const Chat = ({socket , name, roomId}) => {
    const [msg, setMsg] = useState("")
    const [chatList, setChatList] = useState([])

    useEffect(() => {
        socket.on('message',(message)=>{
            // setChatList((prev)=>[...prev,message])
            setChatList((prev)=>[...prev, message])
        })
        socket.on('receive_message',(data)=>{
            console.log(data);
            setChatList((prev)=>[...prev,data])
        })
      }, [socket])

      const sendMessage = async () => {
        if (msg !== "") {
            const payload = {
                id: uuidv4(),
                name: name,
                roomId: roomId,
                message: msg,
                time: moment().format('h:mm a')
            }
            console.log("sent=>",payload);
            await socket.emit('send_message', payload)
            setChatList((list) => [...list, payload])
            console.log(chatList);
            setMsg("")
        }
    }

    return (
        <div className='main-div' >
            <div className="header">
                <h1>Chat Application</h1>
            </div>
            <div className="patent-body">
                <div className="users-rooms-info-parent-div">
                    <div className="user-room-info-div">
                        <h4>Room Name</h4>
                        <h5>{name}</h5>
                        <h4>Users Name</h4>
                        <h5>{roomId}</h5>
                    </div>
                    <button type='button' >Leave Room</button>
                </div>
                <div className="parent-chatting-div">
                    <div className="chat-message-div">
                        {chatList.map((res)=>{
                            return(
                                <div className='chat-message-item' key={res.id} >
                                    {res.message}
                                    <div className="meta">
                                        <p>{res.name}</p>
                                        <p>{res.time}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="footer">
                        <form className='form-div'>
                            <input type="text" value={msg}  onChange={(e)=>{setMsg(e.target.value)}} placeholder='Type your message...' />
                            <button type='button' onClick={sendMessage} >send</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chat