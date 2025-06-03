// Use the base configuration as-is.
exports = require('@dydxprotocol/node-service-base-dev/jest.config');

module.exports = {
  ...exports,
  roots: ['<rootDir>/build/cjs/__tests__'],
  testRegex: 'build/cjs/__tests__\\/.*\\.test\\.js$',
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
  coveragePathIgnorePatterns: ['src/codegen/'],
};
