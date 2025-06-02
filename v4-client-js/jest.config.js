import { createRequire } from 'module';

import * as baseConfig from '@dydxprotocol/node-service-base-dev/jest.config.js';

// Create require function for resolving paths in ESM
const require = createRequire(import.meta.url);

export default {
  ...baseConfig,
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
  coveragePathIgnorePatterns: ['src/codegen/'],
};
