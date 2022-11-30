import React from 'react';
import './Player.css';
import { Card, Badge, Button, Group, Text, Image } from '@mantine/core';
import { CardDTO } from '../../entities';
import { GameUserDTO } from '../../entities/gameDTO';
import { AttackCardSelection } from '../Game/Game';
interface Props {
  player: GameUserDTO;
  attacker: boolean;
  attackCardSelection: AttackCardSelection | undefined;
  setAttackCardSelection: (attackCardSelection: AttackCardSelection) => void;
}

export const Player = ({
  player,
  attacker,
  attackCardSelection,
  setAttackCardSelection,
}: Props) => {
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
          <div className="playerActionPoints">
            Action points : {player.actionPoints}
          </div>
        </section>
      </div>
      {player && (
        <div className="playerCards">
          {player.cards?.map((card: CardDTO) => {
            return (
              <Card
                key={card.id}
                className={`gameCard ${
                  attacker
                    ? attackCardSelection?.attacker?.id == card.id &&
                      'selectedCard'
                    : attackCardSelection?.defender?.id == card.id &&
                      'selectedCard'
                }`}
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
                  disabled={Math.round(card.energy) === 0 || Math.round(card.hp) === 0}
                  onClick={() => {
                    if (attacker) {
                      attackCardSelection &&
                        setAttackCardSelection({
                          ...attackCardSelection,
                          attacker: card,
                        });
                    } else {
                      attackCardSelection &&
                        setAttackCardSelection({
                          ...attackCardSelection,
                          defender: card,
                        });
                    }
                    console.log(attackCardSelection);
                  }}>
                  {/* attacker? (attackCardSelection? setAttackCardSelection({...attackCardSelection, attacker:card}):null):(attackCardSelection? setAttackCardSelection({...attackCardSelection, defender:card}):null)}
                    }> */}
                  {Math.round(card.hp) > 0 ?
                    Math.round(card.energy) > 0
                      ? attacker
                        ? 'Use'
                        : 'Attack'
                      : 'No energy'
                    : 'Dead'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
