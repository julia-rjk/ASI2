import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncFn } from 'react-use';
import { StoreLayout } from '../../components/StoreLayout';
import { setUser } from '../../redux/user.action';
import { selectUser } from '../../redux/user.selector';
import { sellCardAsync } from '../../services/storeService';

export const Sell = () => {
  const user = useSelector(selectUser);
  const userCards = user.cards ? [...user.cards] : [];

  const dispatch = useDispatch();

  const [sellState, onSell] = useAsyncFn(
    async (card_id: number) => {
      const res = await sellCardAsync({ user_id: user.id, card_id });
      const soldCard = user.cards?.find((card) => card.id === card_id);
      const newCards = userCards.filter((card) => card !== soldCard);

      dispatch(
        setUser({
          ...user,
          cards: newCards,
          account: (user.account ?? 0) + (soldCard?.price ?? 0),
        }),
      );
      return res;
    },
    [user],
  );

  return (
    <StoreLayout
      cards={userCards}
      onAction={onSell}
      loading={sellState.loading}
      type="sell"
    />
  );
};
