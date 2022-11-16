import React from 'react';
import { TextInput, Button, Group, Stack, PasswordInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useAsyncFn } from 'react-use';
import { register } from '../services/userService';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user.action';

interface Props {
  onRegister: (
    login: string,
    password: string,
    email: string,
    lastName: string,
    surName: string,
  ) => void;
  loading: boolean;
}

export const Register = ({ onRegister, loading }: Props) => {
  const form = useForm({
    initialValues: {
      email: '',
      login: '',
      password: '',
      repassword: '',
      lastName: '',
      surName: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      login: (value) => (value.length > 0 ? null : 'Login is required'),
      password: (value) => (value.length > 0 ? null : 'Password is required'),
      repassword: (value, { password }) =>
        value.length > 0
          ? value === password
            ? null
            : 'Password must be the same'
          : 'Password is required',
      lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
      surName: (value) => (value.length > 0 ? null : 'First name is required'),
    },
  });

  const [visiblePassword, handlePasswordVisible] = useDisclosure(false);
  const [visibleRePassword, handleRePasswordVisible] = useDisclosure(false);

  return (
    <Stack sx={{ maxWidth: 380 }} mx="auto">
      <form
        onSubmit={form.onSubmit((values) =>
          onRegister(
            values.login,
            values.password,
            values.email,
            values.lastName,
            values.surName,
          ),
        )}>
        <TextInput
          withAsterisk
          label="LastName"
          {...form.getInputProps('lastName')}
        />

        <TextInput
          withAsterisk
          label="Surname"
          {...form.getInputProps('surName')}
        />

        <TextInput
          withAsterisk
          label="Login"
          {...form.getInputProps('login')}
        />

        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          withAsterisk
          label="Password"
          visible={visiblePassword}
          onVisibilityChange={handlePasswordVisible.toggle}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          withAsterisk
          label="Confirm password"
          visible={visibleRePassword}
          onVisibilityChange={handleRePasswordVisible.toggle}
          {...form.getInputProps('repassword')}
        />

        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Confirm
          </Button>
        </Group>
      </form>
    </Stack>
  );
};
