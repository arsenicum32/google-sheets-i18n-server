const db = require('../infrastructure/db')
const sheetsClient = require('../infrastructure/sheetsClient')

const {
  rowsToTranslations,
  flatToNested,
} = require('./translationTransform')

const getTranslations = async ({ project, tag = 'master' }) => {
  const spreadsheetId = await db.get(project)

  if (!spreadsheetId) {
    throw new Error('Project does not exist')
  }

  const rows = await sheetsClient.getRows({
    spreadsheetId,
    range: `${tag}!A1:Z`,
  })

  return rowsToTranslations(rows)
}

module.exports = {
  async getFlat({ project, lang, tag }) {
    const translations = await getTranslations({ project, tag })
    return translations[lang] || {}
  },

  async getStructured({ project, lang, tag }) {
    const translations = await getTranslations({ project, tag })
    return flatToNested(translations[lang] || {})
  },
}