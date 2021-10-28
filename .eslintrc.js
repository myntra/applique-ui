module.exports = {
  extends: '@myntra/standard',
  overrides: [
    {
      files: ['**/*.spec.js'],
      globals: {
        mount: 'readonly',
        mountShallow: 'readonly',
        testCodeMod: 'readonly'
      },
      rules: {
        'node/no-extraneous-import': [
          'error',
          {
            allowModules: ['enzyme']
          }
        ]
      }
    }
  ]
}
