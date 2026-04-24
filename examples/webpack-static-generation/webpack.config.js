const path = require('path')
const axios = require('axios')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const I18N_API_URL = 'http://localhost:7996/v1/projects/portfolio/translations'
const LANGUAGES = ['en', 'ru']

const loadTranslations = async (lang) => {
  const { data } = await axios.get(`${I18N_API_URL}/${lang}`, {
    params: {
      tag: 'landing',
      format: 'nested',
    },
  })

  return data
}

module.exports = async () => {
  const translations = Object.fromEntries(
    await Promise.all(
      LANGUAGES.map(async lang => [
        lang,
        await loadTranslations(lang),
      ]),
    ),
  )

  return {
    entry: './src/index.js',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },

    plugins: LANGUAGES.map(lang =>
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: lang === 'en' ? 'index.html' : `${lang}/index.html`,
        templateParameters: {
          lang,
          text: translations[lang],
        },
      }),
    ),
  }
}