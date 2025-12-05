module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'], // Шукати файли .test.ts
  verbose: true,
  forceExit: true,
  clearMocks: true,
};