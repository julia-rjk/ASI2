import React from 'react';
import { TextInput, Button, Group, Stack, PasswordInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

export const Register = () => {
  const form = useForm();
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Stack sx={{ maxWidth: 380 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput withAsterisk label="Name" />

        <TextInput withAsterisk label="Surname" />

        <PasswordInput
          withAsterisk
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
        />
        <PasswordInput
          withAsterisk
          label="Confirm password"
          visible={visible}
          onVisibilityChange={toggle}
        />

        <Group position="right" mt="md">
          <Button type="submit">Confirmer</Button>
        </Group>
      </form>
    </Stack>
  );
};
