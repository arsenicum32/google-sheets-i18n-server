# webpack-plugin example

Writes per-language JSON files into the webpack output directory at build time.

## Usage

```js
const SaverLangsPlugin = require('./saverPlugin')

plugins: [
  new SaverLangsPlugin({
    url: 'http://localhost:7996/v1/projects/app/translations/all?tag=master&format=nested',
    outputPath: path.resolve(__dirname, 'dist/i18n'),
    variant: 'main',
    hash: process.env.BUILD_HASH || 'dev',
    languageNames: { en: 'English', ru: 'Русский' },
  }),
]
```

## Output

```
dist/i18n/languages.main.<hash>.json
dist/i18n/en.main.<hash>.json
dist/i18n/ru.main.<hash>.json
```

