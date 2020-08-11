module.exports = {
  '*.{ts}': ['eslint --fix'],
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '*.{ts,js,json,yml}': ['prettier --write'],
}
