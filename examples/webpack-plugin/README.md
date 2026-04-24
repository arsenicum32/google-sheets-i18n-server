# Webpack plugin example

This example writes translation JSON files into the Webpack output directory during build.

## Output

For variant `main` and hash `abc123`, the plugin writes:

```text
languages.main.abc123.json
en.main.abc123.json
ru.main.abc123.json
```

## Usage

```ts
import SaverLangsPlugin from './SaverLangsPlugin'

plugins: [
  new SaverLangsPlugin({
    url: 'http://localhost:7996/v1/projects/app/translations/all?tag=master&format=nested',
    outputPath: path.resolve(__dirname, 'dist/i18n'),
    variant: 'main',
    hash: process.env.BUILD_HASH || 'dev',
    languageNames: {
      en: 'English',
      ru: 'Русский',
    },
  }),
]
```

If the API returns one language per request, call the endpoint for each language before writing files, or add a bulk endpoint on the server side.
