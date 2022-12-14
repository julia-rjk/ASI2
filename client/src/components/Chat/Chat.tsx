import { Card, Tabs } from '@mantine/core';
import React, { useState } from 'react';
import { MessageDTO } from '../../entities/messageDTO';
import './Chat.css';
import { TabChat } from './TabChat';

interface Props {
  messages: MessageDTO[];
  sendMessage: (message: string, roomId?: string) => void;
  roomId?: string;
}

export const Chat = ({ messages, sendMessage, roomId }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>(
    roomId ? 'room' : 'general',
  );

  const [general, room] = messages.reduce(
    (acc, message) => {
      if (message.room && message.room === roomId) {
        acc[1].push(message);
      } else {
        acc[0].push(message);
      }
      return acc;
    },
    [[], []] as MessageDTO[][],
  );

  return (
    <Card unstyled className="container">
      <Card.Section withBorder inheritPadding py="xs">
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="general">General</Tabs.Tab>
            {roomId && <Tabs.Tab value="room">Room</Tabs.Tab>}
          </Tabs.List>

          <Tabs.Panel className="tabPanel" value="general" pt="xs">
            <TabChat
              messages={general}
              sendMessage={(message) => sendMessage(message)}
            />
          </Tabs.Panel>
          {roomId && (
            <Tabs.Panel className="tabPanel" value="room" pt="xs">
              <TabChat
                messages={room}
                sendMessage={(message) => sendMessage(message, roomId)}
              />
            </Tabs.Panel>
          )}
        </Tabs>
      </Card.Section>
    </Card>
  );
};
