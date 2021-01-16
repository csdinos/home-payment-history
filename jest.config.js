const {pathsToModuleNameMapper} = require('ts-jest/utils')
module.exports = {
  rootDir: './',
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      autoMapModuleNames: true,
      diagnostics: false
    }
  },
  testPathIgnorePatterns: ['/build/'],
  moduleNameMapper: pathsToModuleNameMapper(
    require('./tsconfig.json').compilerOptions.paths,
    {
      prefix: '<rootDir>/'
    }
  )
};