const rules = {
  "no-var-requires": false,
  "no-console": false,
  "interface-name": [true, "never-prefix"],
  "object-literal-sort-keys": false,
  "ordered-imports": false,
  "jsx-no-lambda": false,
  "max-classes-per-file": false
};
module.exports = {
  extends: ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  linterOptions: {
    exclude: ["config/**/*.js", "node_modules/**/*.ts", "coverage/lcov-report/*.js", "**/*.scss.d.ts", "jest.config.js"]
  },
  rules,
  jsRules: rules
};
