import React, { useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { StoreLayout } from '../../components/StoreLayout';
import { getAllCardsOnSell } from '../../services/cardService';
import { buyCardAsync } from '../../services/storeService';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/user.selector';
import { setUser } from '../../redux/user.action';
import { CardDTO } from '../../entities';
import { Center, Loader, Text } from '@mantine/core';
import './Buy.css';

export const Buy = () => {
  const [cardsOnSellState, setCardsOnSell] = useState<CardDTO[]>([]);
  const cardsOnSell = useAsync(async () => {
    const res = await getAllCardsOnSell();
    setCardsOnSell(res);
    return res;
  }, []);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [buyState, onBuy] = useAsyncFn(
    async (card_id: number) => {
      const boughtCard = cardsOnSellState.find((card) => card.id === card_id);
      const newAccount = (user.account ?? 0) - (boughtCard?.price ?? 0);
      if (newAccount >= 0) {
        const res = await buyCardAsync({ user_id: user.id, card_id });
        const newCards = user.cards ? [...user.cards] : [];
        boughtCard ? newCards.push(boughtCard) : null;
        setCardsOnSell((prev) => prev.filter((card) => card.id !== card_id));

        dispatch(
          setUser({
            ...user,
            cards: newCards,
            account: newAccount,
          }),
        );

        return res;
      }
      throw new Error('Not enough money');
    },
    [cardsOnSellState],
  );

  if (cardsOnSell.error?.message) {
    return <div>{cardsOnSell.error.message}</div>;
  }

  if (cardsOnSell.loading || !cardsOnSell.value) {
    return (
      <Center className="loader">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <StoreLayout
        cards={cardsOnSellState}
        onAction={onBuy}
        loading={buyState.loading}
        type="buy"
      />
      <Text color="red">{buyState.error?.message}</Text>
    </>
  );
};
