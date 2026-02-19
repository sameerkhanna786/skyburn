export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/tests/**/*.test.js'],
  transformIgnorePatterns: [],
  watchman: false,
};
