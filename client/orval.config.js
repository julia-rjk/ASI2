module.exports = {
  users: {
    input: process.env.REACT_APP_USERURL + '/v3/api-docs',
    output: {
      target: 'src/services/userService.ts',
      mode: 'split',
      schemas: 'src/entities',
      prettier: true,
      override: {
        mutator: {
          path: 'src/api/userApi.ts',
          name: 'userApi',
        },
      },
    },
  },
  store: {
    input: process.env.REACT_APP_STOREURL + '/v3/api-docs',
    output: {
      target: 'src/services/storeService.ts',
      mode: 'split',
      schemas: 'src/entities',
      prettier: true,
      override: {
        mutator: {
          path: 'src/api/storeApi.ts',
          name: 'storeApi',
        },
      },
    },
  },
  cards: {
    input: process.env.REACT_APP_CARDURL + '/v3/api-docs',
    output: {
      target: 'src/services/cardService.ts',
      mode: 'split',
      schemas: 'src/entities',
      prettier: true,
      override: {
        mutator: {
          path: 'src/api/cardApi.ts',
          name: 'cardApi',
        },
      },
    },
  },
};
