import { Group, Avatar, Text } from '@mantine/core';
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
        <Text>{userName}</Text>
        {messageTime && (
          <Text c="dimmed" size="xs">
            {messageTime}
          </Text>
        )}
      </div>
    </Group>
  );
};
