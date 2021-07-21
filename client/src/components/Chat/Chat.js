import React, { useState, useEffect } from 'react';
import QueryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({ location }) => {
    // use state hooks to store and modify states within Chat
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // the address where the server is stored
    const ENDPOINT = 'https://react-rt-chatting-app.herokuapp.com/';

    // perform side effects using effect hooks
    useEffect(() => {
        const { name, room } = QueryString.parse(location.search);

        socket = io(ENDPOINT)

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {
            
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat