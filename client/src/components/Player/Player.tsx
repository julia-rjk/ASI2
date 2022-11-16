import React from 'react';
import './Player.css';

interface Props {
  playerName: string;
  playerActionPoints: number | undefined;
}

export const Player = ({ playerName, playerActionPoints }: Props) => {

  return (
    <div className='playerContainer'>
      <div className="playerInfo">
        <div className="playerName">Player : {playerName}</div>
        <div className="playerActionPoints">Action points : {playerActionPoints}</div>
      </div>
      <div className="playerCards">

      </div>
      <div className="selectedCard">
        
      </div>
    </div>
  );
};
