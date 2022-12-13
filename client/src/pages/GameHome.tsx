import { Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

export const GameHome = () => {
  return (
    <>
      <h2>Game rules</h2>
      <h3>Join a game</h3>
      <ul>
        <li>Select between 1 and 4 cards</li>
        <li>
          This will either create a new game and let you wait for another
          player, or make you join one if another player is already waiting
        </li>
        <li>
          Once two players joined the same game, a random player is going to be
          selected to start and the game will start
        </li>
      </ul>
      <h3>How a turn unfolds (for the player who's turn it is)</h3>
      <ul>
        <li>Chose the attacker card in your deck</li>
        <li>Chose the card you want to attack in your oponent's deck</li>
        <li>Click attack to launch the attack</li>
        <li>
          Each attacks cost 1 action point and some energy to the attacking card
        </li>
        <li>You can use the multiplier to launch multiple attacks at once</li>
        <li>
          Your turn ends when you don't have any cards available (life or
          energy), when you don't have no action points, or when you click
          endturn.
        </li>
      </ul>
      <h3>Game logic and strategies</h3>
      <ul>
        <li>The card's regain energy each turn</li>
        <li>You regain action points each turn</li>
        <li>
          The more action points you have at the end of your turn, the more
          energy you will get next turn
        </li>
      </ul>
      <h3>End of game</h3>
      <ul>
        <li>The game will end when a player has no cards with life left</li>
        <li>By default the winner gets 100 coins</li>
      </ul>
      <Button component={Link} to="/game/play">
        Play!!!
      </Button>
    </>
  );
};
