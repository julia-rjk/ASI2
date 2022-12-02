import { Group, Avatar, Text, Stack } from '@mantine/core';
import React from 'react';
import {} from 'tabler-icons-react';

interface Props {
  messageTime?: string;
  userName: string;
}

export const UserAvatar = ({ messageTime, userName }: Props) => {
  return (
    <Group>
      <Avatar />
      <div>
        <Text align="left">{userName}</Text>
        {messageTime && (
          <Text align="left" c="dimmed" size="xs">
            {messageTime}
          </Text>
        )}
      </div>
    </Group>
  );
};
