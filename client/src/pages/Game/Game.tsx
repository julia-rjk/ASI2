import React, { useEffect } from 'react';
import { Player } from '../../components/Player/Player';
import { io } from 'socket.io-client';
import './Game.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';

export const Game = () => {
  const socket = io('http://localhost:8087');
  const user = useSelector(selectUser);
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('joinWaitingList', { user });
      console.log('connected');
    });
  }, []);

  return (
    <div id="gameContainer">
      <div id="chat">Chat (TODO)</div>
      <div id="game">
        <Player
          playerName={`${user.lastName} ${user.surName}`}
          playerActionPoints={100}></Player>
        <div id="controls">
          <button className="control">End turn</button>
          <button className="control">Attack ⚔️</button>
        </div>
        {/* {cond ? <A /> : <B />} */}
        <Player playerName={'Julia'} playerActionPoints={100}></Player>
      </div>
    </div>
  );
};
