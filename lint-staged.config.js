module.exports = {
  'src/**/*.{ts}': ['eslint --fix'],
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '*.{ts,js,json,yml,md}': ['prettier --write'],
}
