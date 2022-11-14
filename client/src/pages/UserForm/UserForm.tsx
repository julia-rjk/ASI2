import React from 'react';
import { Box, Tabs } from '@mantine/core';
import { Login } from '../../components/Login';
import { Register } from '../../components/Register';

export const UserForm = () => {
  return (
    <Box sx={{ maxWidth: 380 }} mx="auto">
      <Tabs defaultValue="login">
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="register">Register</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login">
          <Login />
        </Tabs.Panel>
        <Tabs.Panel value="register">
          <Register />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
