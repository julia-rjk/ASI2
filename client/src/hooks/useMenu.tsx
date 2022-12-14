import React from 'react';
import {
  Article,
  DeviceGamepad,
  PigMoney,
  ShoppingCart,
} from 'tabler-icons-react';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

export const useMenu = () => {
  return [
    {
      name: 'BUY',
      path: '/store/buy',
      icon: <ShoppingCart size={48} color="black" />,
    },
    {
      name: 'SELL',
      path: '/store/sell',
      icon: <PigMoney size={48} color="black" />,
    },
    {
      name: 'GAME RULES',
      path: '/game',
      icon: <Article size={48} color="black" />,
    },
    {
      name: 'PLAY',
      path: '/game/play',
      icon: <DeviceGamepad size={48} color="black" />,
    },
  ] as MenuItem[];
};
