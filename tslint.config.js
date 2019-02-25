const sharedRules = {
  "no-var-requires": false,
  "no-console": false,
  "object-literal-sort-keys": false,
  "jsx-no-lambda": false,
  "max-classes-per-file": false
};
const tsRules = {
  "interface-name": [true, "never-prefix"]
};
module.exports = {
  extends: ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  linterOptions: {
    exclude: ["node_modules", "coverage/lcov-report/*.js"]
  },
  rules: { ...sharedRules, ...tsRules },
  jsRules: sharedRules
};
