# webpack-static-generation example

Fetches translations at build time and generates per-locale static HTML via HtmlWebpackPlugin.

Best for landing pages and SEO-critical sites where translations must be baked into the HTML.

## Usage

```js
// webpack.config.js
module.exports = async () => {
  const translations = Object.fromEntries(
    await Promise.all(
      LANGUAGES.map(async lang => [lang, await loadTranslations(lang)]),
    ),
  )

  return {
    plugins: LANGUAGES.map(lang =>
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: lang === 'en' ? 'index.html' : `${lang}/index.html`,
        templateParameters: { lang, text: translations[lang] },
      }),
    ),
  }
}
```

