import React from 'react';
import { TextInput, Button, Group, Stack, PasswordInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

interface Props {
  onLogin: (loginValue: string, passwordValue: string) => void;
  loading: boolean;
}

export const Login = ({ onLogin, loading }: Props) => {
  const form = useForm({
    initialValues: { loginValue: '', passwordValue: '' },
    validate: {
      loginValue: (value) => (value.length > 0 ? null : 'Login is required'),
      passwordValue: (value) =>
        value.length > 0 ? null : 'Password is required',
    },
  });
  const [visible, { toggle }] = useDisclosure(false);

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
          <Button type="submit" loading={loading}>
            Connect
          </Button>
        </Group>
      </form>
    </Stack>
  );
};
