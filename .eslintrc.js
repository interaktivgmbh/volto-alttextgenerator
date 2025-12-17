const fs = require('fs');
const projectRootPath = __dirname;
const { AddonRegistry } = require('@plone/registry/addon-registry');

const nodeModulesLocation = `${projectRootPath}/packages/@interaktivgmbh/volto-alttextgenerator/node_modules`;

const { registry } = AddonRegistry.init(`${nodeModulesLocation}/@plone/volto`);

// Extends ESlint configuration for adding the aliases to `src` directories in Volto addons
const addonAliases = Object.keys(registry.packages).map((o) => [
  o,
  registry.packages[o].modulePath,
]);

module.exports = {
  ignorePatterns: ['node_modules/'],
  extends: `${nodeModulesLocation}/@plone/volto/.eslintrc`,
  rules: {
    'import/no-unresolved': 1,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: false,
      },
      plugins: ['@typescript-eslint'],
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@plone/volto', `${nodeModulesLocation}/@plone/volto/src`],
          ['@plone/volto-slate', `${nodeModulesLocation}/@plone/volto-slate/src`],
          ['@plone/registry', `${nodeModulesLocation}/@plone/registry/src`],
          [
            '@interaktivgmbh/volto-alttextgenerator',
            './packages/@interaktivgmbh/volto-alttextgenerator/src',
          ],
          ...addonAliases,
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
};
