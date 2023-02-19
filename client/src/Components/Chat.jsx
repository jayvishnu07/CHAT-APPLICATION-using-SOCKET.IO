import React, { useEffect, useState } from 'react'
import './/Chat.css'
import moment from 'moment'
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { BsDoorOpenFill } from 'react-icons/bs';
import { GiExitDoor } from 'react-icons/gi';

const Chat = ({ socket, name, roomId ,setShowChat }) => {
    const [msg, setMsg] = useState("")
    const [chatList, setChatList] = useState([])

    useEffect(() => {
        socket.on('message', (message) => {
            setChatList((prev) => [...prev, message])
            // document.querySelector(".form-div input").focus()
        })
    }, [socket])


    useEffect(() => {

        let ele = document.querySelector(".chat-message-div")
        if (ele) {
            ele.scrollTop = ele.scrollHeight
        }
    }, [chatList])


    const sendMessage = async (e) => {
        e.preventDefault()
        if (msg !== "") {
            const payload = {
                name: name,
                roomId: roomId,
                message: msg,
                type : 'message',
                time: moment().format('h:mm a')
            }
            console.log("sent=>", payload);
            await socket.emit('send_message', payload)
            setChatList((list) => [...list, payload])
            console.log(chatList);
            setMsg("")
        }

    }

    const leaveRoomHandler = () => {
        socket.disconnect();
        setShowChat(false);
        console.log('clicked');
    }

    return (
        <div className='main-div' >
            <div className="header">
                <h1>Chat Application</h1>
            </div>
            <div className="patent-body">
                <div className="users-rooms-info-parent-div">
                    <div className="user-room-info-div">
                        <p id='user-info-title' ><FaUser /> User</p>
                        <p id='user-info-value'>{name}</p>
                        <p id='user-info-title'><BsDoorOpenFill /> Room Name</p>
                        <p id='user-info-value'>{roomId}</p>
                    </div>
                    <button type='button' onClick={leaveRoomHandler} ><GiExitDoor id='leave-btn-logo' /> Leave Room</button>
                </div>
                <div className="parent-chatting-div">
                    <div className="chat-message-div">
                        {chatList.map((res, key) => {
                            return (
                                <div className={res.type === 'notification' ? 'chat-message-item' : res.name === name ? 'me' : 'others'} key={key} >
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
                        <form className='form-div' onSubmit={sendMessage} >
                            <input type="text" value={msg} onChange={(e) => { setMsg(e.target.value) }} placeholder='Type your message...' />
                            <button type='button' onClick={sendMessage}  >Send
                                <RiSendPlaneFill id='send-btn-logo' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chat