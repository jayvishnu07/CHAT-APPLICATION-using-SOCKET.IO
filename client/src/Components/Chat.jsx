import React, { useEffect, useState, useRef } from 'react'
import './/Chat.css'
import moment from 'moment'
import { GrSend } from 'react-icons/gr';
import { FaUser } from 'react-icons/fa';
import { BsDoorOpenFill } from 'react-icons/bs';
import { GiExitDoor } from 'react-icons/gi';
import { IoIosPeople, IoIosPerson } from 'react-icons/io';
import { FcApproval } from "react-icons/fc";


const Chat = ({ socket, name, roomId, setShowChat }) => {
    const focusRef = useRef()
    const [msg, setMsg] = useState("")
    const [chatList, setChatList] = useState([])
    const [userNames, setUserNames] = useState([])


    useEffect(() => {
        if (socket)
            socket.on('message', (message) => {
                setChatList((prev) => [...prev, message])
            })
        socket.on('get-users', (data) => {
            setUserNames([])
            data.map((item) => {
                if (item.roomId === roomId) {
                    setUserNames(prev => [...prev, item])
                }
            })
        })
    }, [socket])

    useEffect(() => {
        let scroll = document.querySelector(".chat-message-div")
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight
        }
    }, [chatList])

    useEffect(() => {
        socket.emit("message-after-refresh", { name: name, roomId: roomId })
        socket.on('get-message-after-refresh', (data) => {
            // setChatList(data)
            setChatList(data)
        })
    }, [])



    const sendMessage = async (e) => {
        e.preventDefault()
        if (msg !== "") {
            const payload = {
                name: name,
                roomId: roomId,
                socketId: socket.id,
                message: msg,
                type: 'message',
                time: moment().format('h:mm a')
            }
            await socket.emit('send_message', payload)
            setChatList((list) => [...list, payload])
            setMsg("")
        }
        focusRef.current.focus();
    }

    useEffect(() => {
        document.querySelector("#send-btn-logo path").setAttribute('stroke', '#fff')
    }, [chatList])

    const leaveRoomHandler = () => {

        socket.disconnect();
        localStorage.clear();
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
                        <p id='user-info-value'>{name}<FcApproval id='verified-icon' /></p>
                        <p id='user-info-title'><BsDoorOpenFill /> Room Name</p>
                        <p id='user-info-value'>{roomId}</p>
                    </div>
                    <div className="members-outer-parent-div">
                        <p><IoIosPeople id='members-logo' /> Room Members</p>
                        <div className="members-inner-parent-div">
                            {
                                userNames.map((data, index) => {
                                    return (
                                        <div key={index} className='members-item-div' ><p><IoIosPerson id='member-logo' />{data.userName} </p> </div>
                                    )
                                })
                            }
                        </div>
                    </div>


                    <button type='button' onClick={leaveRoomHandler} ><GiExitDoor id='leave-btn-logo' /> Leave Room</button>
                </div>
                <div className="parent-chatting-div">
                    <div className="chat-message-div">
                        {chatList.map((res, key) => {
                            return (
                                (( (res.type === 'greetings' && res.name === name ) || (res.type === 'message') || (res.type === 'notify-others' && res.name !== name) || (res.type === 'endcard' && res.name !== name ) )&& (res.roomId === roomId) ) ?
                                    (<div className={res.type === ( 'endcard') ? 'chat-message-item' : res.type ==='notify-others' ? 'chat-message-item' : res.type === 'greetings' ? 'chat-message-item' :   res.name === name ? 'me' : 'others'} key={key} >
                                        <p id={res.type === ('notify-others' || 'endcard') ? 'sender-name-notification' : 'sender-name-message'} >~ {res.name}</p>
                                        {res.message}
                                        <p id={res.type === ('notify-others' || 'endcard') ? 'send-time-notification' : 'send-time-message'} >{res.time}</p>
                                    </div>)
                                    :
                                    ''
                            )
                        })}
                    </div>
                    <div className="footer">
                        <form className='form-div' onSubmit={sendMessage} >
                            <input type="text" value={msg} ref={focusRef} onChange={(e) => { setMsg(e.target.value) }} placeholder='Type your message...' />
                            <button type='button' onClick={sendMessage}  >Send
                                <GrSend color='red' id='send-btn-logo' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chat