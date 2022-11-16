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
import { CardDTO } from '../../entities';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';

export const Store = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<number>();
  const { cards } = useSelector(selectUser);

  useEffect(() => {
    if (type !== 'buy' && type !== 'sell') {
      navigate(-1);
    }
  }, [type, navigate]);

  const elements: CardDTO[] = type === 'sell' ? cards ?? [] : [];

  const rows = elements?.map((element, index) => (
    <tr onClick={() => setSelectedCardId(index)} key={index}>
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
