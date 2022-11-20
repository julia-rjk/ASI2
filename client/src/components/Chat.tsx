import React, { useEffect } from 'react';
import {
    AppShell,
    Header,
    Group,
    Text,
    Avatar,
    Title,
    Menu,
    TextInput,
} from '@mantine/core';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/user.selector';
import { CurrencyDollar, Home, Logout } from 'tabler-icons-react';
import { setUser } from '../redux/user.action';
import { io } from 'socket.io-client';
import { useForm } from '@mantine/form';

export const Chat = () => {

    const socket = io('http://localhost:8087');

    const pathName = useLocation().pathname;
    const title = useMenu().find((item) => pathName === item.path)?.name;
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const form = useForm({
        initialValues: {
            msg: ''
        }
    }
    );

    useEffect(() => {

        socket.on('connect', () => {
            socket.emit('chat:getUsers')

            const names = ["user1", "user2"]
            names.sort((a, b) => a.localeCompare(b));
            const actualRoomName = names[0] + "-vs-" + names[1]

            // Join chatroom
            socket.emit('chat:joinRoom', { "userId": "user", "room": actualRoomName });
            socket.emit('chat:joinRoom', { "userId": "user2", "room": actualRoomName });


            socket.on('chat:getMessage', (message) => {
                outputMessage(message);
                const chatMessages2 = document.querySelector('.chat-messages')
                if(chatMessages2?.scrollTop != undefined) chatMessages2.scrollTop = chatMessages2?.scrollHeight;
            });

        });
    }, [socket]);

    // Output message to DOM
    function outputMessage(message: any) {
        console.log(message)
        const div = document.createElement('div');
        div.classList.add('message');

        const p = document.createElement('p');
        p.classList.add('meta');
        p.innerText = message.userId;
        p.innerHTML += `<span>${message.time}</span>`;
        div.appendChild(p);

        const para = document.createElement('p');
        para.classList.add('text');
        para.innerText = message.text;
        div.appendChild(para);

        document?.querySelector('.chat-messages')?.appendChild(div);
    }



    //TODO: Fonction pour envoyer un message
    function sendMessage(socket: any, message: any) {
        console.log("Sending messag : " + message);
        socket.emit('chat:sendMessage', (message));

    }

    if (!!!user) {
        return <Navigate to="/public" />;
    }

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1><i className="fas fa-kiwi-bird"></i> Chat </h1>
            </header>
            <div className="form-control">

                <label htmlFor="availableUsers">Utilisateur disponible</label>
                <select name="availableUsers" id="availableUsers">
                </select>

            </div>
            <main className="chat-main">
                <div className="chat-sidebar">
                    <h2 id="room-name"></h2>
                    <h3><i className="fas fa-user"></i> Online</h3>
                    <ul id="users">
                    </ul>
                </div>
                <div className="chat-messages">
                </div>
            </main>

            <div className="chat-form-container">
                <form id="chat-form"
                    onSubmit={form.onSubmit((values) =>
                        sendMessage(
                            socket,
                            values.msg
                        ),
                    )}
                >
                    <TextInput
                        withAsterisk
                        label="msg"
                        {...form.getInputProps('msg')}
                    />
                    {/* <input
                        id="msg"
                        type="text"
                        placeholder="Type a Message"
                        required
                    /> */}
                    <button className="btn-plane"><i className="fas fa-paper-plane"></i> </button>
                </form>
            </div>

            <div className="chat-form-container">
                <form id="chat-form-broadcast">
                    <input
                        id="msg"
                        type="text"
                        placeholder="Envoyer à tout le monde"
                        required />
                    <button className="btn-plane"><i className="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    );
};
