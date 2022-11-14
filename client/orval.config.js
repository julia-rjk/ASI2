module.exports = {
  users: {
    input: 'http://localhost:8081/v3/api-docs',
    output: {
      target: 'src/services/userService.ts',
      mode: 'split',
      schemas: 'src/entities',
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: 'src/api/api.ts',
          name: 'api',
        },
      },
    },
  },
};
