import React, { useEffect, useState } from 'react';
import { Player } from '../Player';
import './Game.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import GameDTO, { GameUserDTO } from '../../entities/gameDTO';
import { Button, Card, Group, Modal, Image, Badge, Text } from '@mantine/core';
import { CardDTO, UserDTO } from '../../entities';
import { useLayoutContext } from '../Layout/Layout';
import { io } from 'socket.io-client';

export class AttackCardSelection {
  attacker!: CardDTO;
  defender!: CardDTO;
}

export const Game = () => {
  const user = useSelector(selectUser);
  const { setRoomId, socket } = useLayoutContext();
  const [opened, setOpened] = useState(true);
  const [selectedCards, setSelectedCards] = useState<CardDTO[]>([]);
  const [attackCardSelection, setAttackCardSelection] =
    useState<AttackCardSelection>(new AttackCardSelection());
  const [game, setGame] = useState<GameDTO>();

  const addOrRemove = (arr: CardDTO[], item: CardDTO, rm: boolean) => {
    if (rm) {
      return arr.filter((i) => i !== item);
    } else {
      return arr.includes(item)
        ? arr.filter((i) => i !== item)
        : [...arr, item];
    }
  };

  /* Listening for changes on the socket. */
  useEffect(() => {
    socket.on('updateGame', (game: GameDTO, damage?: number) => {
      if (!game) return;
      setRoomId(game.gameId);
      if (game.nextTurn && game.nextTurn.id === user.id) {
        if (game.nextTurn.actionPoints === 0) {
          endTurn(game.gameId);
        } else {
          console.log(game.nextTurn.actionPoints);
        }
      }
      // update game
      if (!damage) {
        setGame(game);
        return;
      }
      // update game and show damage
      setGameAnimated(game);
      // show type of damage
      // if (damage === 0) printMessage('Missed');
      // else if (damage < 90) printMessage('Hit');
      // else printMessage('Critical Hit');
      //TODO: afficher l'update de la game (annimation ou alert quand en fonctino des damage [crit, normal, miss])
      const looser = hasLost(game);
      if (!looser) {
        return;
      }
      socket.emit('endGame', game.gameId, looser.id);
    });
    socket.on('gameFinished', (game: GameDTO, looser: UserDTO) => {
      console.log('gameFinished', game, looser, user.id);
      if (user.id === looser) {
        alert('You lost');
      } else {
        alert('You won');
      }
    });
    return () => {
      // leave game
      // socket.emit('leaveGame', game?.gameId, user.id);
      // setRoomId(undefined);
    };
  }, [setRoomId, socket]);

  /**
   * Connect() is a function that emits a 'joinWaitingList' event to the server with the user object
   * and the selectedCards array as the data.
   */
  const connect = () => {
    socket.emit('joinWaitingList', { ...user, cards: selectedCards });
  };

  const setGameAnimated = (game: GameDTO) => {
    setGame(game);
    // setTimeout(() => {
    //   setGame(game);
    // }, 1000);
  };

  /**
   * When the attack button is clicked, the attackCardSelection is reset and the attack event is
   * emitted to the server.
   */
  const attack = () => {
    const gameId = game?.gameId;
    const attackerId = attackCardSelection.attacker.id;
    const defenderId = attackCardSelection.defender.id;
    setAttackCardSelection(new AttackCardSelection());
    socket.emit('attack', gameId, attackerId, defenderId);
  };

  /**
   * When the endTurn button is clicked, emit an event to the server with the gameId.
   */
  const endTurn = (gameId?: string) => {
    if (!gameId) socket.emit('endTurn', game?.gameId);
    else socket.emit('endTurn', gameId);
  };

  /**
   * If player1Lost is true, return game.player1, else if player2Lost is true, return game.player2,
   * else return undefined.
   * @param {GameDTO} game - GameDTO
   * @returns The player who lost.
   */
  const hasLost = (game: GameDTO) => {
    if (!game) {
      return;
    }
    let lost = true;
    // get the user playing
    let userPlaying: GameUserDTO;
    game.player1.id === user.id
      ? (userPlaying = game.player1)
      : (userPlaying = game.player2);
    if (!userPlaying.cards) {
      return;
    }
    // check if the user has lost
    userPlaying.cards.forEach((card) => {
      if (card.hp > 0) {
        lost = false;
      }
    });
    // return player if lost
    if (lost) {
      return userPlaying;
    }
  };

  // const updateGame = () => {

  // };

  const printMessage = (message: string) => {
    // TODO: complete
    const print = document.createElement('p');
    print.innerHTML = message;
    document.appendChild(print);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Select up to 4 cards 🃏 end click on play ▶️"
        size="fit-content"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}>
        <div className="selectCardsContainer">
          <div className="playerCards">
            {user.cards?.map((card: CardDTO) => {
              return (
                <Card
                  key={card.id}
                  className={`${
                    selectedCards.includes(card) && 'selectedCard'
                  } gameCard`}
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
                    disabled={
                      selectedCards.length >= 4 && !selectedCards.includes(card)
                    }
                    onClick={() =>
                      setSelectedCards((prev) =>
                        addOrRemove(prev, card, !(selectedCards.length < 4)),
                      )
                    }>
                    {selectedCards.includes(card) ? 'Remove' : 'Select'}
                  </Button>
                </Card>
              );
            })}
          </div>
          <Button
            disabled={selectedCards?.length == 0}
            onClick={() => {
              setOpened(false);
              connect();
            }}>
            Play
          </Button>
        </div>
      </Modal>
      <div id="gameContainer">
        <div id="game" className="gameSubContainer">
          <Player
            player={
              game
                ? game.player1.id === user.id
                  ? game.player1
                  : game.player2
                : { ...user, cards: [] }
            }
            attacker={true}
            attackCardSelection={attackCardSelection}
            setAttackCardSelection={setAttackCardSelection}
          />
          {game?.nextTurn?.id === user.id ? (
            <div id="controls">
              <Button className="control" onClick={() => endTurn()}>
                End turn
              </Button>
              <hr />
              <Button
                disabled={
                  attackCardSelection.attacker == undefined ||
                  attackCardSelection.defender == undefined
                }
                className="control"
                onClick={() => attack()}>
                Attack ⚔️
              </Button>
            </div>
          ) : (
            <hr />
          )}
          {game && game.player2 ? (
            <Player
              attacker={false}
              attackCardSelection={attackCardSelection}
              setAttackCardSelection={setAttackCardSelection}
              player={game.player1.id === user.id ? game.player2 : game.player1}
            />
          ) : (
            <div className="waitingForOpponent">Waiting for opponent</div>
          )}
        </div>
      </div>
    </>
  );
};
