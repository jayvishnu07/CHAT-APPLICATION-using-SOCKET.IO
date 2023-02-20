import React, { useEffect, useState, useRef } from 'react'
import './/Chat.css'
import moment from 'moment'
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { BsDoorOpenFill } from 'react-icons/bs';
import { GiExitDoor } from 'react-icons/gi';

const Chat = ({ socket, name, roomId ,setShowChat }) => {
    const focusRef = useRef()
    const [msg, setMsg] = useState("")
    const [chatList, setChatList] = useState([])

    useEffect(() => {
        if (socket)
        socket.on('message', (message) => {
            setChatList((prev) => [...prev, message])
        })
    }, [socket])


    useEffect(() => {

        let scroll = document.querySelector(".chat-message-div")
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight
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
            await socket.emit('send_message', payload)
            setChatList((list) => [...list, payload])
            setMsg("")
        }
            focusRef.current.focus();
    }

    const leaveRoomHandler = () => {
        socket.disconnect();
        setShowChat(false);
    }

    return (
        <div className='main-div' >
            <div className="header">
                <h1>Chat Application</h1>
                <button type='button' onClick={leaveRoomHandler} className='leave-button-for-phone' ><GiExitDoor id='leave-btn-logo' /> Leave Room</button>
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
                                    <p id= {res.type === 'notification' ? 'sender-name-notification' : 'sender-name-message'} >~ {res.name}</p>
                                    {res.message}
                                    <p id= {res.type === 'notification' ? 'send-time-notification' : 'send-time-message'} >{res.time}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="footer">
                        <form className='form-div' onSubmit={sendMessage} >
                            <input type="text" value={msg} ref={focusRef} onChange={(e) => { setMsg(e.target.value) }} placeholder='Type your message...' />
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