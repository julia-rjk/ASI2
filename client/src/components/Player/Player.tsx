import React from 'react';
import './Player.css';
import {
  Table,
  Grid,
  Card,
  Badge,
  Button,
  Group,
  Text,
  Image,
} from '@mantine/core';
interface Props {
  playerName: string;
  playerActionPoints: number | undefined;
  player: any;
}

export const Player = ({ playerName, playerActionPoints, player }: Props) => {

  return (
    <div className='playerContainer'>
      <div className="playerInfo">
        <section>
          <img className="playerIcon" src="https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg" alt='' />
          <span className="playerName">{playerName}</span>
        </section>
        <section>
          <label htmlFor="playerActionPoints">Action points : {playerActionPoints}</label>
          <progress id="playerActionPoints" max="100" value={playerActionPoints}> {playerActionPoints}</progress>
        </section>
      </div>
      {player ?
        <div className="playerCards">
          {player?.cards?.map((card: any) => {
            return (
              <Card key={card.id} className="gameCard" shadow="sm" p="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={card.model?.imgUrl}
                    height={80}
                    alt=""
                  />
                </Card.Section>
                <Text weight={500}>{card.model?.name}</Text>
                <Text size="sm" color="dimmed">{card.model?.description}</Text>
                
                <Group className='stats'>
                  <Badge color="green">❤️‍🩹 : {Math.round(card.hp)}</Badge>
                  <Badge color="magenta">⚡ : {Math.round(card.energy)}</Badge>
                </Group>
                <Group className='stats'>
                  <Badge color="red">⚔️ : {Math.round(card.attack)}</Badge>
                  <Badge color="blue">🛡️ : {Math.round(card.defence)}</Badge>
                </Group>
                

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  // loading={buyState.loading || sellState.loading}
                  onClick={() => null}>
                  Select
                </Button>

              </Card>
            )
          }
          )}
        </div>
        : null}
      <div className="selectedCard">

      </div>
    </div>
  );
};
