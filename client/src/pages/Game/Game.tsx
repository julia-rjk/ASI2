import React, { useEffect, useState } from 'react';
import { Box, Grid, Tabs } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../../redux/user.selector';
import { Chat } from '../../components/Chat';
import './Game.css';
import { connect } from "../../api";

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8086";

export const Game = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.emit('joinRoom', { "username":"julia", "room":"waitingRoom" });

    socket.on("FromAPI", data => {
      console.log(data)
    });
  }, []);

  return (
    <Grid>
      <Grid.Col>
        
      </Grid.Col>
      <Grid.Col span="auto">
        <Chat />
      </Grid.Col>
      <Grid.Col span="auto">
        <div>
          <h1>Hello World!</h1>
        </div>
      </Grid.Col>
    </Grid>
  );
};
