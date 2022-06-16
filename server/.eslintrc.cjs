module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["import", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "node/no-missing-import": "off",
    "import/no-unresolved": "error",
    "node/no-extraneous-import": [
      "error",
      {
        allowModules: ["utils"],
      },
    ],
    "node/no-unpublished-import": [
      "error",
      {
        allowModules: ["pino", "pino-pretty"],
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
