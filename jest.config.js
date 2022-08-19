module.exports = {
  coveragePathIgnorePatterns: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>'],
  setupFiles: ['<rootDir>/jest.init.js'],
  testEnvironment: 'jsdom',
  testRegex: '/__tests__/.*\\.(ts|tsx|js)$',
  transform: {
    '\\.(js|ts|tsx)$': 'babel-jest',
  },
  verbose: true,
};
