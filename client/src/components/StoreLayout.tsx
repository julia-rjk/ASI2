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
    <Grid>
      <Grid.Col span="auto">
        <Table striped highlightOnHover withBorder withColumnBorders>
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
      </Grid.Col>
      {selectedCard && (
        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section>
              <Image src={selectedCard.model?.imgUrl} height={160} alt="" />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>{selectedCard.model?.name}</Text>
              <Badge color="pink" variant="light">
                Own
              </Badge>
            </Group>

            <Text size="sm" color="dimmed">
              {selectedCard.model?.description}
            </Text>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              loading={loading}
              onClick={() => {
                selectedCard.id && onAction(selectedCard.id);
                setSelectedCard(undefined);
              }}>
              {type === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </Card>
        </Grid.Col>
      )}
    </Grid>
  );
};
