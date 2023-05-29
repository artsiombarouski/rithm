/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: false,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};
