import React, { useEffect, useState } from 'react';
import { Player } from '../Player';
import './Game.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import GameDTO, { GameUserDTO } from '../../entities/gameDTO';
import { Button, Card, Group, Modal, Image, Badge, Text } from '@mantine/core';
import { CardDTO, UserDTO } from '../../entities';
import { useLayoutContext } from '../Layout/Layout';
import { io } from 'socket.io-client';
import { setUser } from '../../redux/user.action';
import JSConfetti from 'js-confetti';
import { Link } from 'react-router-dom';

export class AttackCardSelection {
  attacker!: CardDTO;
  defender!: CardDTO;
}

class Multiplier {
  static x1 = 1;
  static x2 = 2;
  static x3 = 3;
  static x4 = 4;
  static x5 = 5;
  static toggle(number: number): number {
    if (number >= Multiplier.x5) return Multiplier.x1;
    else return number + 1;
  }
}

export const Game = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { setRoomId, socket } = useLayoutContext();
  const [selectCardOpened, setSelectCardOpened] = useState(true);
  const [selectedCards, setSelectedCards] = useState<CardDTO[]>([]);
  const [attackCardSelection, setAttackCardSelection] =
    useState<AttackCardSelection>(new AttackCardSelection());
  const [multiplier, setMultiplier] = useState(Multiplier.x1);
  const [game, setGame] = useState<GameDTO>();
  const jsConfetti = new JSConfetti();
  // messageBox
  const [messageBoxOpened, setMessageBoxOpened] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState('');

  const addOrRemove = (arr: CardDTO[], item: CardDTO, rm: boolean) => {
    if (rm) {
      return arr.filter((i) => i !== item);
    } else {
      return arr.includes(item)
        ? arr.filter((i) => i !== item)
        : [...arr, item];
    }
  };
  // Do only on init
  useEffect(() => {
    socket.emit('isInGame', user);
  }, []);

  // Listening for changes on the socket.
  useEffect(() => {
    socket.on('updateGame', (game: GameDTO, damage?: number) => {
      selectCardOpened && setSelectCardOpened(false);
      if (!game) return;
      autoSelect(game);
      setRoomId(game.gameId);
      if (game.nextTurn && game.nextTurn.id === user.id) {
        if (game.nextTurn.actionPoints === 0) {
          endTurn(game.gameId);
        }
      }
      // update game
      setGame(game);

      if (damage == null) {
        return;
      }
      // show type of damage
      if (damage === 0) printMessage('Missed');
      else if (damage < 90) printMessage('Hit');
      else {
        printMessage('Critical');
      }
      const looser = hasLost(game);
      if (!looser) {
        return;
      }
      setTimeout(() => {
        socket.emit('endGame', game.gameId, looser.id);
      }, 1000);
    });
    socket.on('gameFinished', (game: GameDTO, looser: UserDTO) => {
      if (game.player1.id === user.id) {
        user.account = game.player1.account;
      } else {
        user.account = game.player2.account;
      }
      dispatch(setUser(user));
      if (user.id === looser) {
        printMessage('Defeat');
      } else {
        printMessage('Victory');
        jsConfetti.addConfetti();
      }
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    });
  }, [setRoomId, socket]);

  // Connect() is a function that emits a 'joinWaitingList' event to the server with the user object and the selectedCards array as the data.
  const connect = () => {
    socket.emit('joinWaitingList', { ...user, cards: selectedCards });
  };

  // Auto select a card if the user has only one card he can use
  const autoSelect = (game: GameDTO) => {
    // find the number of selectable cards, if 1, select it
    let selectableAttackers;
    let selectableDefenders;
    if (game.player1.id === user.id) {
      if (game.player1.cards) {
        selectableAttackers = game.player1.cards.filter(
          (c: CardDTO) => c.hp > 0 && c.energy > 0,
        );
      }

      if (game.player2 && game.player2.cards) {
        selectableDefenders = game.player2.cards.filter(
          (c: CardDTO) => c.hp > 0,
        );
      }
    } else {
      if (game.player2 && game.player2.cards) {
        selectableAttackers = game.player2.cards.filter(
          (c: CardDTO) => c.hp > 0 && c.energy > 0,
        );
      }
      if (game.player1.cards) {
        selectableDefenders = game.player1.cards.filter(
          (c: CardDTO) => c.hp > 0,
        );
      }
    }
    if (selectableAttackers && selectableAttackers.length === 1)
      attackCardSelection.attacker = selectableAttackers[0];
    if (selectableDefenders && selectableDefenders.length === 1)
      attackCardSelection.defender = selectableDefenders[0];
    setAttackCardSelection(attackCardSelection);
  };

  // When the attack button is clicked, the attackCardSelection is reset and the attack event is emitted to the server.
  const attack = () => {
    const gameId = game?.gameId;
    const attackerId = attackCardSelection.attacker.id;
    const defenderId = attackCardSelection.defender.id;
    setAttackCardSelection(new AttackCardSelection());
    for (let i = 0; i < multiplier; i++) {
      socket.emit('attack', gameId, attackerId, defenderId);
    }
  };

  // When the endTurn button is clicked, emit an event to the server with the gameId.
  const endTurn = (gameId?: string) => {
    if (!gameId) socket.emit('endTurn', game?.gameId);
    else socket.emit('endTurn', gameId);
  };

  // If player1Lost is true, return game.player1, else if player2Lost is true, return game.player2, else return undefined.
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

  // When the function is called, it sets the message box content to the message that was passed in, sets the message box to opened, and then after a second, sets the message box to closed.
  const printMessage = (message: string) => {
    setMessageBoxContent(message);
    setMessageBoxOpened(true);
    // time out
    setTimeout(() => {
      setMessageBoxOpened(false);
    }, 1000);
  };

  const leaveGame = () => {
    socket.emit('leaveGame', game?.gameId, user.id);
    setRoomId(undefined);
    window.location.href = '/';
  };

  return (
    <>
      <div className="messageBox">
        <div
          className={`${messageBoxContent.toLowerCase()} ${
            messageBoxOpened && 'open'
          }`}>
          {messageBoxContent} !
        </div>
      </div>
      <Modal
        opened={selectCardOpened}
        onClose={() => setSelectCardOpened(false)}
        title="Select up to 4 cards 🃏 end click on play ▶️"
        size="fit-content"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        className="cardsSelectionPannel">
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
                  radius="md"
                  withBorder>
                  <Card.Section>
                    <Image
                      src={card.model?.imgUrl}
                      className="cardImage"
                      alt=""
                    />
                  </Card.Section>
                  <Text weight={500} className="cardName">
                    {card.model?.name}
                  </Text>
                  <Text className="cardDescription" color="dimmed">
                    {card.model?.description}
                  </Text>

                  <Group className="stats">
                    <Badge className="cardStat" color="green">
                      ❤️‍🩹 : {card.hp && Math.round(card.hp)}
                    </Badge>
                    <Badge className="cardStat" color="magenta">
                      ⚡ : {card.energy && Math.round(card.energy)}
                    </Badge>
                    <Badge className="cardStat" color="red">
                      ⚔️ : {card.attack && Math.round(card.attack)}
                    </Badge>
                    <Badge className="cardStat" color="blue">
                      🛡️ : {card.defence && Math.round(card.defence)}
                    </Badge>
                  </Group>

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    radius="md"
                    className="selectCardButton"
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
              setSelectCardOpened(false);
              connect();
            }}>
            Play
          </Button>
        </div>
      </Modal>
      <div id="gameContainer">
        <div id="game">
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
                {attackCardSelection.attacker &&
                attackCardSelection.attacker.model?.attackName
                  ? attackCardSelection.attacker.model?.attackName + ' ⚔️'
                  : 'Attack ⚔️'}
              </Button>
              <Button
                id="multiplyButton"
                onClick={() => {
                  multiplier && setMultiplier(Multiplier.toggle(multiplier));
                }}>
                {multiplier}
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
        <Button onClick={() => leaveGame()}>Leave game</Button>
      </div>
    </>
  );
};
