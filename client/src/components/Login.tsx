import React from 'react';
import {
  TextInput,
  Button,
  Group,
  Stack,
  PasswordInput,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { useAsyncFn } from 'react-use';
import { login } from '../services/userService';
import { setUser } from '../redux/user.action';

export const Login = () => {
  const form = useForm({
    initialValues: { loginValue: '', passwordValue: '' },
    validate: {
      loginValue: (value) => (value.length > 0 ? null : 'Login is required'),
      passwordValue: (value) =>
        value.length > 0 ? null : 'Password is required',
    },
  });
  const [visible, { toggle }] = useDisclosure(false);

  const dispatch = useDispatch();

  const [loginState, onLogin] = useAsyncFn(
    async (loginValue: string, passwordValue: string) => {
      const res = await login({ login: loginValue, password: passwordValue });

      if (res) {
        dispatch(setUser(res));
        return res;
      }
      throw new Error('Error');
    },
    [],
  );

  return (
    <Stack sx={{ maxWidth: 380 }} mx="auto">
      <form
        onSubmit={form.onSubmit((values) =>
          onLogin(values.loginValue, values.passwordValue),
        )}>
        <TextInput
          withAsterisk
          label="Login"
          {...form.getInputProps('loginValue')}
        />

        <PasswordInput
          withAsterisk
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          {...form.getInputProps('passwordValue')}
        />

        <Group position="right" mt="md">
          <Button type="submit" loading={loginState.loading}>
            Connect
          </Button>
        </Group>
      </form>
      {loginState.error && <Text color="red">{loginState.error.message}</Text>}
    </Stack>
  );
};
