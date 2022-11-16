module.exports = {
  users: {
    input: 'http://localhost:8081/v3/api-docs',
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
    input: 'http://localhost:8084/v3/api-docs',
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
    input: 'http://localhost:8085/v3/api-docs',
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
