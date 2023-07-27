module.exports = {
  extends: '@applique-ui/standard',
  overrides: [
    {
      files: ['**/*.spec.js'],
      globals: {
        mount: 'readonly',
        testCodeMod: 'readonly',
      },
      rules: {
        'node/no-extraneous-import': [
          'error',
          {
            allowModules: ['enzyme'],
          },
        ],
      },
    },
  ],
}
