import React, { useEffect } from 'react';
import { Player } from '../../components/Player/Player';
import { io } from 'socket.io-client';
import './Game.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import { UserDTO } from '../../entities';
import GameDTO from '../../entities/gameDTO';
import { Button } from '@mantine/core';

export const Game = () => {
  const socket = io('http://localhost:8087');
  const user = useSelector(selectUser);
  const selectedCards = user.cards?.slice(0, 4);
  user.cards = selectedCards;
  const [game, setGame] = React.useState<GameDTO>();
  const [player1, setPlayer1] = React.useState<UserDTO>();
  const [player2, setPlayer2] = React.useState<UserDTO>();


  useEffect(() => {
    setPlayer1(user);
    socket.on("connect", () => {
      socket.emit('joinWaitingList', { user, selectedCards });
      console.log('connected')
    });
    socket.on('startingPlay', (game) => {
      setGame(game);
      if (game.player1.id == user.id) {
        setPlayer1(game.player1);
        setPlayer2(game.player2);
        console.log("You are player 1\nSTARTING TO PLAY WITH " + player2?.surName);
      }
      else {
        setPlayer1(game.player2);
        setPlayer2(game.player1);
        console.log("You are player 2\nSTARTING TO PLAY WITH " + player1?.surName);
      }

      if (game.nextTurn == user.id) {
        //TODO
        console.log("It's your turn");
        // attack()
      } else {
        //TODO
        console.log("Waiting for your turn");
      }

    });
    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    // TODO: Use https://mantine.dev/core/modal/ to select the card to play
    <div id="gameContainer">
      <div id="chat" className='gameSubContainer'>Chat (TODO)</div>
      <div id='game' className='gameSubContainer'>
        <Player playerName={player1?.surName + " " + player1?.lastName} playerActionPoints={player1?.actionPoints} player={player1}></Player>
        <div id='controls'>
          <Button className='control'>End turn</Button>
          <hr />
          <Button className='control'>Attack ⚔️</Button>
        </div>
        <Player playerName={player2 ? player2?.surName + " " + player2?.lastName : "Waiting for player..."} playerActionPoints={player1?.actionPoints} player={player2}></Player> :
      </div>
    </div>
  );
};