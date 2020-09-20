module.exports = {
  testEnvironment: 'node',
  moduleDirectories: [
    'node_modules', // This is required
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*.(spec|test).(js|ts)'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
  collectCoverageFrom: ['src/**/*.ts'],
  verbose: true,
};
