module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  resetMocks: false,
  setupFiles: [],
  moduleNameMapper: {
    "^app(.*)$": "<rootDir>/src/app$1",
    "^widgets(.*)$": "<rootDir>/src/widgets$1"
  }
};
