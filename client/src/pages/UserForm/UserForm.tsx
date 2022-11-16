import React from 'react';
import { Box, Tabs } from '@mantine/core';
import { Login } from '../../components/Login';
import { Register } from '../../components/Register';
import { useAsyncFn } from 'react-use';
import { setUser } from '../../redux/user.action';
import { login, register } from '../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { UserDTO } from '../../entities/userDTO';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../../redux/user.selector';

export const UserForm = () => {
  const dispatch = useDispatch();

  const [connectState, onConnect] = useAsyncFn(
    async (fn: Promise<UserDTO | void>) => {
      const res = await fn;

      if (res) {
        dispatch(setUser(res));
        return res;
      }
      throw new Error('Error');
    },
    [],
  );

  const onLogin = (loginValue: string, passwordValue: string) =>
    onConnect(login({ login: loginValue, password: passwordValue }));

  const onRegister = (
    login: string,
    password: string,
    email: string,
    lastName: string,
    surName: string,
  ) =>
    onConnect(
      register({
        login: login,
        password: password,
        email: email,
        lastName: lastName,
        surName: surName,
      }),
    );

  const user = useSelector(selectUser);

  if (!!user) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ maxWidth: 380 }} mx="auto">
      <Tabs defaultValue="login">
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="register">Register</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login">
          <Login onLogin={onLogin} loading={connectState.loading} />
        </Tabs.Panel>
        <Tabs.Panel value="register">
          <Register onRegister={onRegister} loading={connectState.loading} />
        </Tabs.Panel>
      </Tabs>
      {connectState.error && <div>{connectState.error.message}</div>}
    </Box>
  );
};
