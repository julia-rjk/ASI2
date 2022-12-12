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
import React, { useState } from 'react';
import { CardDTO } from '../entities';
import './StoreLayout.scss';

interface Props {
  cards: CardDTO[];
  onAction: (cardId: number) => void;
  loading: boolean;
  type: 'buy' | 'sell';
}

export const StoreLayout = ({ cards, onAction, loading, type }: Props) => {
  const [selectedCard, setSelectedCard] = useState<CardDTO>();

  const rows = cards.map((element, index) => (
    <tr onClick={() => setSelectedCard(element)} key={index}>
      <td>{element.model?.name}</td>
      <td>{element.model?.description}</td>
      <td>{element.model?.family}</td>
      <td>{element.attack}</td>
      <td>{element.defence}</td>
      <td>{element.hp}</td>
      <td>{element.price}</td>
    </tr>
  ));

  return (
    <div className="storeLayout">
      <div className="storeTableContainer">
        <Table
          striped
          highlightOnHover
          withBorder
          withColumnBorders
          className="storeTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Family</th>
              <th>Attack</th>
              <th>Defence</th>
              <th>HP</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
      {selectedCard && (
        <Card shadow="sm" p="lg" radius="md" withBorder className="gameCard">
          <Card.Section>
            <Image
              src={selectedCard.model?.imgUrl}
              className="cardImage"
              alt=""
            />
          </Card.Section>

          <Text weight={500} className="cardName">
            {selectedCard.model?.name}
          </Text>
          <Text className="cardDescription" color="dimmed">
            {selectedCard.model?.description}
          </Text>

          <Group className="stats">
            <Badge className="cardStat" color="green">
              ❤️‍🩹 : {selectedCard.hp && Math.round(selectedCard.hp)}
            </Badge>
            <Badge className="cardStat" color="magenta">
              ⚡ : {selectedCard.energy && Math.round(selectedCard.energy)}
            </Badge>
            <Badge className="cardStat" color="red">
              ⚔️ : {selectedCard.attack && Math.round(selectedCard.attack)}
            </Badge>
            <Badge className="cardStat" color="blue">
              🛡️ : {selectedCard.defence && Math.round(selectedCard.defence)}
            </Badge>
          </Group>

          <Button
            variant="light"
            color="blue"
            fullWidth
            radius="md"
            className="selectCardButton"
            loading={loading}
            onClick={() => {
              selectedCard.id && onAction(selectedCard.id);
              setSelectedCard(undefined);
            }}>
            {type === 'buy' ? 'Buy' : 'Sell'}
          </Button>
        </Card>
      )}
    </div>
  );
};
