import React from 'react';
import {
  AppShell,
  Header,
  Group,
  Text,
  Avatar,
  Title,
  Menu,
} from '@mantine/core';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/user.selector';
import { CurrencyDollar, Home, Logout } from 'tabler-icons-react';
import { setUser } from '../redux/user.action';

export const Layout = () => {
  const pathName = useLocation().pathname;
  const title = useMenu().find((item) => pathName === item.path)?.name;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  if (!!!user) {
    return <Navigate to="/public" />;
  }

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
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Group>
                  <Avatar />
                  <Text>{`${user.lastName} ${user.surName}`}</Text>
                </Group>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<CurrencyDollar size={14} color="black" />}>
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
      <Outlet />
    </AppShell>
  );
};
