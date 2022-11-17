import React from 'react';
import './Player.css';
import { Card, Badge, Button, Group, Text, Image } from '@mantine/core';
import { CardDTO } from '../../entities';
import { GameUserDTO } from '../../entities/gameDTO';
interface Props {
  player: GameUserDTO;
}

export const Player = ({ player }: Props) => {
  return (
    <div className="playerContainer">
      <div className="playerInfo">
        <section>
          <img
            className="playerIcon"
            src="https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg"
            alt=""
          />
          <span className="playerName">{`${player.surName} ${player.lastName}`}</span>
        </section>
        <section>
          <label htmlFor="playerActionPoints">
            Action points : {player.actionPoints}
          </label>
          <progress
            id="playerActionPoints"
            max="100"
            value={player.actionPoints}>
            {player.actionPoints}
          </progress>
        </section>
      </div>
      {player && (
        <div className="playerCards">
          {player.cards?.map((card: CardDTO) => {
            return (
              <Card
                key={card.id}
                className="gameCard"
                shadow="sm"
                p="lg"
                radius="md"
                withBorder>
                <Card.Section>
                  <Image src={card.model?.imgUrl} height={80} alt="" />
                </Card.Section>
                <Text weight={500}>{card.model?.name}</Text>
                <Text size="sm" color="dimmed">
                  {card.model?.description}
                </Text>

                <Group className="stats">
                  <Badge color="green">
                    ❤️‍🩹 : {card.hp && Math.round(card.hp)}
                  </Badge>
                  <Badge color="magenta">
                    ⚡ : {card.energy && Math.round(card.energy)}
                  </Badge>
                </Group>
                <Group className="stats">
                  <Badge color="red">
                    ⚔️ : {card.attack && Math.round(card.attack)}
                  </Badge>
                  <Badge color="blue">
                    🛡️ : {card.defence && Math.round(card.defence)}
                  </Badge>
                </Group>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => null}>
                  Select
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
