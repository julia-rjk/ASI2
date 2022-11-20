import React, { useEffect, useState } from 'react';
import { Player } from '../../components/Player/Player';
import { io } from 'socket.io-client';
import './Game.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import GameDTO from '../../entities/gameDTO';
import { Button, Card, Group, Modal, Image, Badge, Text } from '@mantine/core';
import { CardDTO } from '../../entities';
import { Socket } from 'socket.io';
import { Chat } from '../../components/Chat';

export class AttackCardSelection {
  attacker!: CardDTO;
  defender!: CardDTO;
}

export const Game = () => {
  const user = useSelector(selectUser);
  const [socket, setSocket] = useState<any>();
  const [game, setGame] = useState<GameDTO>();
  const [opened, setOpened] = useState(false);
  const [selectedCards, setSelectedCards] = useState<CardDTO[]>();
  const [attackCardSelection, setAttackCardSelection] = useState<AttackCardSelection>();
  
  const addOrRemove = (arr:any, item:any, rm?:boolean) => {
    if (rm) {
      return arr.filter((i:any) => i !== item);
    } else {
      return arr.includes(item) ? arr.filter((i: any) => i !== item) : [ ...arr, item ]
    }
  };

  useEffect(() => {
    setSocket(io('http://localhost:8087'))
    setOpened(true)
    setSelectedCards([]);
    setAttackCardSelection(new AttackCardSelection());
    socket?.on('connect', () => {
      console.log('connected');
    });
    return () => {
      socket?.disconnect();
    };

  }, []); 
  function connect() {
    socket?.emit('joinWaitingList', {...user, cards:selectedCards});
    socket?.on('startingPlay', (game:any) => {
      setGame(game);
    });
  }

  useEffect(() => {
    if (game) {
      if (game.nextTurn === user.id) {
        console.log("It's your turn");
      } else {
        console.log('Waiting for your turn');
      }
    }
  }, [game]);

  const attack = () => {
    socket?.emit('attack', { user, game });
    // TODO: implement attack
  };

  const endTurn = () => {
    socket?.emit('endTurn', { user, game });
    // TODO: implement endTurn
  };

  return (
    <>
      {/* <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Select up to 4 cards 🃏 end click on play ▶️"
        size="fit-content"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <div className="selectCardsContainer">
          <div className="playerCards">
            {user.cards?.map((card: CardDTO) => {
              return (
                <Card 
                  key={card.id}
                  className={`${selectedCards?.includes(card) && "selectedCard"} gameCard`}
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
                    disabled={selectedCards && selectedCards?.length >= 4 && !selectedCards?.includes(card)}
                    onClick={() => selectedCards && selectedCards.length < 4 ? setSelectedCards(addOrRemove(selectedCards,card)):setSelectedCards(addOrRemove(selectedCards,card, true))}
                    >
                    {selectedCards?.includes(card)? "Remove" : "Select"}
                  </Button>
                </Card>
              );
            })}
          </div>
          <Button disabled={selectedCards?.length == 0} onClick={() => {setOpened(false); connect()}}>Play</Button>
        </div>
      </Modal> */}
      <div id="gameContainer">
        {/* <div id="game" className="gameSubContainer">
          <Player player={game !== undefined? (game.player1.id === user.id ? game.player1 : game.player2) : { ...user, cards: [] }} attacker={true} attackCardSelection={attackCardSelection} setAttackCardSelection={setAttackCardSelection}/>
          {game?.nextTurn.id === user.id? (
            <div id="controls">
              <Button className="control" onClick={() => endTurn()}>
                End turn
              </Button>
              <hr />
              <Button className="control" onClick={() => attack()}>
                Attack ⚔️
              </Button>
            </div>
          ):<hr></hr>}
          {game ? (
            <Player
              attacker={false} attackCardSelection={attackCardSelection} setAttackCardSelection={setAttackCardSelection}
              player={game.player1.id === user.id ? game.player2 : game.player1}
            />
          ) : (
            <div>Waiting for opponent</div>
          )}
        </div> */}
        <div id="chat" className="gameSubContainer">
          <Chat />
        </div>
      </div>
    </>
  );
};