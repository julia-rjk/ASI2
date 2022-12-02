import {
  ScrollArea,
  Group,
  Divider,
  Button,
  Text,
  List,
  TextInput,
  Space,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useRef } from 'react';
import { ArrowDown, DatabaseExport } from 'tabler-icons-react';
import { MessageDTO } from '../../entities/messageDTO';
import { UserAvatar } from '../UserAvatar';

interface Props {
  messages: MessageDTO[];
  sendMessage: (message: string) => void;
}

export const TabChat = ({ messages, sendMessage }: Props) => {
  const viewport = useRef<HTMLDivElement>(null);
  const form = useForm({ initialValues: { message: '' } });
  const scrollToBottom = () =>
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth',
    });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <ScrollArea style={{ height: 300 }} viewportRef={viewport}>
        <List spacing="xs" size="sm" center>
          {messages.map((message, index) => (
            <List.Item
              key={index}
              icon={
                <Group>
                  <UserAvatar
                    userName={message.sender}
                    messageTime={
                      message.date &&
                      new Date(message.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }
                  />
                  <Divider size="lg" orientation="vertical" />
                </Group>
              }>
              <Text>{message.message}</Text>
            </List.Item>
          ))}
        </List>
      </ScrollArea>
      {viewport.current?.scrollHeight !== undefined &&
        viewport.current.scrollHeight > 300 && (
          <Button
            variant="light"
            component={ArrowDown}
            onClick={scrollToBottom}
            className="scrollToBottom"
          />
        )}
      <Divider />
      <Space h="md" />
      <form
        onSubmit={form.onSubmit(({ message }) => {
          sendMessage(message);
          form.reset();
        })}>
        <TextInput
          {...form.getInputProps('message')}
          style={{ width: '100%' }}
          placeholder="Your message"
        />
        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          type="submit"
          disabled={!form.values.message}>
          Send message
        </Button>
      </form>
    </>
  );
};
