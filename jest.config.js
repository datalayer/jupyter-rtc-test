/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */
const path = require("path");

const func = require('@jupyterlab/testutils/lib/jest-config');
const jlabConfig = func(__dirname);

const esModules = [
  '@codemirror',
  '@jupyterlab',
  '@jupyter',
  'lib0',
  'lib0/websocket',
  'nanoid',
  'vscode\\-ws\\-jsonrpc',
  'y\\-protocols',
  'y\\-websocket',
  'y\\-webrtc',
  'yjs'
].join('|');
/*
const {
  moduleFileExtensions,
  moduleNameMapper,
  preset,
  setupFilesAfterEnv,
  setupFiles,
  testPathIgnorePatterns,
  transform
} = jlabConfig;
*/
module.exports = {
/*
  ...jlabConfig,
  moduleFileExtensions,
  moduleNameMapper,
  preset,
  setupFilesAfterEnv,
  setupFiles,
  testPathIgnorePatterns,
  transform,
  automock: false,
*/
//  collectCoverageFrom: [
//    'src/**/*.{ts,tsx}',
//    '!src/**/*.d.ts',
//    '!src/**/.ipynb_checkpoints/*'
//  ],
/*
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
*/
  testRegex: "(/__tests__/.*(test|spec))\\.[jt]sx?$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "lib",
  ],
  transformIgnorePatterns: [
    `/node_modules/(?!${esModules}).+`
  ],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
    '^.+\\.[jt]sx?$': ['babel-jest'],
  },
  preset: "jest-playwright-preset",
}
