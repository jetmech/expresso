module.exports = {
  "plugins": [
    "mocha"
  ],
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "globals": {
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": 9
  },
  "extends": "eslint:recommended",
  "rules": {
    "rules": {
      "mocha/no-exclusive-tests": "error"
    },
    "indent": ["error",
      2,
      { "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": [
      "error"
    ]
  }
}