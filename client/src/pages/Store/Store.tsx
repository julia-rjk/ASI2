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
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import { useAsync, useAsyncFn } from 'react-use';
import { setUser } from '../../redux/user.action';
import { buy, sell } from '../../services/storeService';
import { getAllCardsOnSell } from '../../services/cardService';

export const Store = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CardDTO>();
  const user = useSelector(selectUser);
  const { cards } = user;
  const cardsUser = cards ?? [];

  useEffect(() => {
    if (type !== 'buy' && type !== 'sell') {
      navigate(-1);
    }
  }, [type, navigate]);

  const cardsToSell = useAsync(() => getAllCardsOnSell(), []);

  const elements: CardDTO[] =
    type === 'sell' ? cardsUser : cardsToSell.value ?? [];

  const rows = elements?.map((element, index) => (
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

  const dispatch = useDispatch();

  const [buyState, onBuy] = useAsyncFn(async (card_id: number) => {
    const res = await buy({ user_id: user.id, card_id });

    const newCards = [...cardsUser];
    const newCard = elements.find((id) => id === card_id);
    if (newCard) {
      newCards.push(newCard);
    }
    dispatch(setUser({ ...user, cards: newCards }));
    return res;
  }, []);

  const [sellState, onSell] = useAsyncFn(async (card_id: number) => {
    const res = await sell({ user_id: user.id, card_id });

    dispatch(
      setUser({ ...user, cards: cardsUser.filter((id) => id === card_id) }),
    );
    return res;
  }, []);

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
              loading={buyState.loading || sellState.loading}
              onClick={() =>
                selectedCard.id &&
                (type === 'buy'
                  ? onBuy(selectedCard.id)
                  : onSell(selectedCard.id))
              }>
              {type === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </Card>
        </Grid.Col>
      )}
    </Grid>
  );
};
