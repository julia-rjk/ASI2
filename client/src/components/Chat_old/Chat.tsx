import React, { useEffect } from 'react';
import { TextInput } from '@mantine/core';
import './Chat.css';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import { io } from 'socket.io-client';
import { useForm } from '@mantine/form';

export const Chat_old = () => {
  const socket = io('http://localhost:8087');

  const user = useSelector(selectUser);
  const form = useForm({
    initialValues: {
      msg: '',
    },
  });
  const formBroadcast = useForm({
    initialValues: {
      broadcast: '',
    },
  });

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('chat:getUsers');
      joinRoom(socket, 'everyone');
      socket.on('chat:sendUsers', (message) => {
        const select = document.getElementById('availableUsers');
        for (const user of message.text) {
          const option = document.createElement('option');
          option.text = user.userName;
          option.value = user.userName;
          option.onclick = (e) => {
            setTimeout(() => {
              joinRoom(socket, option.value);
            }, 100);
          };
          select?.appendChild(option);
        }
      });

      socket.on('chat:getMessage', (message) => {
        console.log(message);
        outputMessage(message);
        const chatMessages2 = document.querySelector('.chat-messages');
        if (chatMessages2?.scrollTop != undefined)
          chatMessages2.scrollTop = chatMessages2?.scrollHeight;
      });

      socket.on('chat:getBroadcast', (message) => {
        console.log(message);
        outputMessage(message);
        const chatMessages2 = document.querySelector('.chat-messages');
        if (chatMessages2?.scrollTop != undefined)
          chatMessages2.scrollTop = chatMessages2?.scrollHeight;
      });
    });
  }, [socket]);

  // Output message to DOM
  function outputMessage(message: any) {
    const div = document.createElement('div');
    div.classList.add('message');

    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.userName;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);

    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);

    document?.querySelector('.chat-messages')?.appendChild(div);
  }

  function sendMessage(socket: any, message: any) {
    console.log('Sending message : ' + message);
    socket.emit('chat:sendMessage', message);
  }

  function sendBroadcast(socket: any, message: any) {
    console.log('Sending broadcast : ' + message);
    socket.emit('chat:sendBroadcast', (user.login, message));
  }

  function joinRoom(socket: any, user2: any) {
    const names = [user.login, user2];
    names.sort((a, b) => a.localeCompare(b));
    const actualRoomName = names[0] + '-vs-' + names[1];
    console.log('Joining room : ' + actualRoomName);
    socket.emit('chat:joinRoom', {
      userId: user.id,
      userName: user.login,
      room: actualRoomName,
    });
  }

  if (!!!user) {
    return <Navigate to="/public" />;
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>
          <i className="fas fa-kiwi-bird"></i> Chat{' '}
        </h1>

        <div className="form-control" id="formUsers">
          <div className="selectdiv">
            <label>
              Utilisateur disponible
              <select name="availableUsers" id="availableUsers"></select>
            </label>
          </div>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-sidebar">
          <h2 id="room-name"></h2>
          {/* <h3><i className="fas fa-user"></i> Online</h3>
                    <ul id="users">
                    </ul> */}
        </div>
        <div className="chat-messages"></div>
      </main>

      <div className="chat-form-container">
        <form
          id="chat-form"
          onSubmit={form.onSubmit((values) => sendMessage(socket, values.msg))}>
          <TextInput
            withAsterisk
            label="msg"
            placeholder="Taper un message"
            {...form.getInputProps('msg')}
          />
          <button className="btn-plane"> Envoyer </button>
        </form>
      </div>

      <div className="chat-form-container">
        <form
          id="chat-form-broadcast"
          onSubmit={formBroadcast.onSubmit((values) =>
            sendBroadcast(socket, values.broadcast),
          )}>
          <TextInput
            withAsterisk
            label="broadcast"
            placeholder="Message à tous"
            {...formBroadcast.getInputProps('broadcast')}
          />
          <button className="btn-plane">Envoyer à tous</button>
        </form>
      </div>
    </div>
  );
};
