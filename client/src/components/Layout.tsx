import React from 'react';
import { AppShell, Header, Group, Text, Avatar, Title } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';

export const Layout = () => {
  const pathName = useLocation().pathname;
  const title = useMenu().find((item) => pathName === item.path)?.name;

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position="apart">
            <Text>5000$</Text>
            <Title>{title}</Title>
            <Group>
              <Avatar />
              <Text>John Doe</Text>
            </Group>
          </Group>
        </Header>
      }>
      <Outlet />
    </AppShell>
  );
};
