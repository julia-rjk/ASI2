import React, { useEffect, useState } from 'react';
import { Player } from '../../components/Player/Player';
import { io } from 'socket.io-client';
import './Game.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import GameDTO from '../../entities/gameDTO';
import { Button } from '@mantine/core';

export const Game = () => {
  const socket = io('http://localhost:8087');
  const user = useSelector(selectUser);
  const [game, setGame] = useState<GameDTO>();

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('joinWaitingList', {
        user,
        selectedCards: user.cards?.slice(0, 4),
      });
      console.log('connected');
    });
    socket.on('startingPlay', (game) => {
      setGame(game);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket, user]);

  useEffect(() => {
    if (game) {
      if (game.nextTurn === user.id) {
        console.log("It's your turn");
      } else {
        console.log('Waiting for your turn');
      }
    }
  }, [game, user.id]);

  const attack = () => {
    //socket.emit('attack', { user, game });
    //TODO: implement attack
  };

  const endTurn = () => {
    //socket.emit('endTurn', { user, game });
    //TODO: implement endTurn
  };

  return (
    // TODO: Use https://mantine.dev/core/modal/ to select the card to play
    <div id="gameContainer">
      <div id="chat" className="gameSubContainer">
        Chat (TODO)
      </div>
      <div id="game" className="gameSubContainer">
        <Player player={user} />
        {game?.nextTurn === user.id && (
          <div id="controls">
            <Button className="control" onClick={() => endTurn()}>
              End turn
            </Button>
            <hr />
            <Button className="control" onClick={() => attack()}>
              Attack ⚔️
            </Button>
          </div>
        )}
        {game ? (
          <Player
            player={game.player1 === user.id ? game.player2 : game.player1}
          />
        ) : (
          <div>Waiting for opponent</div>
        )}
      </div>
    </div>
  );
};