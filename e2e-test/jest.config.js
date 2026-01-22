const path = require('path');

// Resolve paths relative to the repo root (where node_modules/detox is located)
const rootDir = path.resolve(__dirname, '..');
const detoxPath = path.join(rootDir, 'node_modules', 'detox');

module.exports = {
  rootDir: rootDir,
  testMatch: ['<rootDir>/e2e-test/**/*.test.ts', '<rootDir>/e2e-test/**/*.test.js'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: path.join(detoxPath, 'runners/jest/globalSetup.js'),
  globalTeardown: path.join(detoxPath, 'runners/jest/globalTeardown.js'),
  reporters: [path.join(detoxPath, 'runners/jest/reporter.js')],
  testEnvironment: path.join(detoxPath, 'runners/jest/testEnvironment/index.js'),
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/e2e-test/setup.ts'],
  watchman: false,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react'
        }
      }
    ]
  }
};

