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
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Card {
  position: number;
  mass: number;
  symbol: string;
  name: string;
}

export const Store = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<number>();

  useEffect(() => {
    if (type !== 'buy' && type !== 'sell') {
      navigate(-1);
    }
  }, [type, navigate]);

  const elements: Card[] = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

  const rows = elements.map((element, index) => (
    <tr onClick={() => setSelectedCardId(index)} key={index}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  return (
    <Grid>
      <Grid.Col span="auto">
        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Element position</th>
              <th>Element name</th>
              <th>Symbol</th>
              <th>Atomic mass</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Grid.Col>
      {selectedCardId !== undefined && (
        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                height={160}
                alt="Norway"
              />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Norway Fjord Adventures</Text>
              <Badge color="pink" variant="light">
                On Sale
              </Badge>
            </Group>

            <Text size="sm" color="dimmed">
              With Fjord Tours you can explore more of the magical fjord
              landscapes with tours and activities on and around the fjords of
              Norway
            </Text>

            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Book classic tour now
            </Button>
          </Card>
        </Grid.Col>
      )}
    </Grid>
  );
};
