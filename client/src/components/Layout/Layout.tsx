import React, { useEffect, useState } from 'react';
import {
  AppShell,
  Header,
  Group,
  Title,
  Menu,
  UnstyledButton,
  Button,
  Dialog,
} from '@mantine/core';
import { Link, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import { Coin, Home, Logout, MessageChatbot } from 'tabler-icons-react';
import { setUser } from '../../redux/user.action';
import './Layout.css';
import { UserAvatar } from '../UserAvatar';
import { Chat } from '../Chat';
import { io, Socket } from 'socket.io-client';
import { MessageDTO } from '../../entities/messageDTO';

const socket = io(
  process.env.REACT_APP_SERVERURL + ''
  ,{
    path: process.env.REACT_APP_GAMEPATH
  }
);


interface OutletContext {
  setRoomId: (id?: string) => void;
  socket: Socket;
}

export const Layout = () => {
  const pathName = useLocation().pathname ;
  const title = useMenu().find((item) => pathName === item.path)?.name;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [chatOpened, setChatOpened] = useState(false);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [roomId, setRoomId] = useState<string>();

  const receiveMessages = (messages: MessageDTO[]) => {
    setMessages((prev) => [...prev, ...messages]);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('chatRoomMessages', (messages: MessageDTO[]) => {
      console.log(messages);
      receiveMessages(messages);
    });
    socket.on('chatMessage', (message: MessageDTO) => {
      receiveMessages([message]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message: string, roomId?: string) => {
    const msg: MessageDTO = {
      message,
      room: roomId,
      userId: user.id || 0,
      sender: `${user.lastName} ${user.surName}`,
    };

    console.log(sendMessage);
    console.log(socket)
    socket.emit('sendMessage', msg);
  };

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} className="header">
          <Group sx={{ height: '100%' }} px={20} position="apart">
            {title && (
              <Link to="/">
                <Home className="headerIcon" size={30} color="black" />
              </Link>
            )}
            <Title className="headerTitle">{title}</Title>
            <Menu shadow="md" width={200} trigger="hover">
              <Menu.Target>
                <UnstyledButton>
                  <UserAvatar userName={`${user.lastName} ${user.surName}`} />
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  className="money"
                  icon={<Coin size={14} color="black" />}>
                  {user.account}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  onClick={() => dispatch(setUser(null))}
                  icon={<Logout size={14} color="black" />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Header>
      }>
      <Outlet context={{ setRoomId, socket }} />
      {!chatOpened && (
        <Button
          className="mantine-1ki991f"
          onClick={() => setChatOpened(true)}
          component={MessageChatbot}
        />
      )}
      <Dialog
        opened={chatOpened}
        withCloseButton
        transition="slide-up"
        onClose={() => setChatOpened(false)}
        style={{ width: 500 }}
        radius="md"
        className="chatDialog">
        <Chat roomId={roomId} messages={messages} sendMessage={sendMessage} />
      </Dialog>
    </AppShell>
  );
};

export const useLayoutContext = () => {
  return useOutletContext<OutletContext>();
};
