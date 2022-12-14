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
import {
  CurrencyDollar,
  Home,
  Logout,
  MessageChatbot,
} from 'tabler-icons-react';
import { setUser } from '../../redux/user.action';
import './Layout.css';
import { UserAvatar } from '../UserAvatar';
import { Chat } from '../Chat';
import { io, Socket } from 'socket.io-client';
import { MessageDTO } from '../../entities/messageDTO';

const socket = io(
  process.env.REACT_APP_GAMERURL + '',
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

  const receiveMessage = (message: MessageDTO) => {
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('chatMessage', (message: MessageDTO) => {
      receiveMessage(message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message: string, roomId?: string) => {
    const msg: MessageDTO = {
      message,
      room: roomId,
      sender: `${user.lastName} ${user.surName}`,
    };
    socket.emit('sendMessage', msg);
  };

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position="apart">
            {title && (
              <Link to="/">
                <Home size={30} color="black" />
              </Link>
            )}
            <Title>{title}</Title>
            <Menu shadow="md" width={200} trigger="hover">
              <Menu.Target>
                <UnstyledButton>
                  <UserAvatar userName={`${user.lastName} ${user.surName}`} />
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  className="money"
                  icon={<CurrencyDollar size={14} color="black" />}>
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
        radius="md">
        <Chat roomId={roomId} messages={messages} sendMessage={sendMessage} />
      </Dialog>
    </AppShell>
  );
};

export const useLayoutContext = () => {
  return useOutletContext<OutletContext>();
};
