import { Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Chat } from '../components/Chat';

export const GameHome = () => {
  return (
    <>
      <Button component={Link} to="/game/play">
        Play!!!
      </Button>
      <Chat />
    </>
  );
};
