module.exports = {
  '*.{js,jsx,json}': [
    'eslint --ext .js,.jsx,.json --fix',
    'prettier --write',
    'git add'
  ],
  '*.{ts,tsx}': ['prettier --write', 'git add'],
  '*.{css,scss}': ['stylelint --fix', 'prettier --write', 'git add']
}
