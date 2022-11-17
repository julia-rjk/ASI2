import React, { useState } from 'react';
import { Box, Tabs, Notification } from '@mantine/core';
import { Login } from '../../components/Login';
import { Register } from '../../components/Register';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../../redux/user.selector';
import { Check } from 'tabler-icons-react';

export const UserForm = () => {
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');

  const user = useSelector(selectUser);

  if (!!user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ maxWidth: 380 }} mx="auto">
      {registerSuccess && (
        <Notification
          onClose={() => {
            setRegisterSuccess(false);
          }}
          icon={<Check size={18} />}
          color="teal"
          title="Success">
          You successfully registered, you can now login
        </Notification>
      )}
      <Tabs
        value={activeTab}
        onTabChange={(tab) => setActiveTab(tab ?? 'login')}>
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="register">Register</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login">
          <Login />
        </Tabs.Panel>
        <Tabs.Panel value="register">
          <Register
            onRegisterSuccess={() => {
              setRegisterSuccess(true);
              setActiveTab('login');
            }}
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
