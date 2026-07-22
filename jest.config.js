module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    "**/__tests__/**/*.test.[tj]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  // ts-jest otherwise inherits module/jsx settings from expo/tsconfig.base
  // (via tsconfig.json's `extends`), which aren't compatible with how Jest
  // runs tests under Node (e.g. ESM-style module output, or a jsx setting
  // Jest's transform can't handle) — this surfaces as "Unexpected token '<'"
  // the moment any test imports a .tsx file with real JSX in it. Scoped
  // only to the Jest transform so it doesn't affect the app/Expo build.
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        jsx: 'react-jsx',
      },
    }],
  },
};