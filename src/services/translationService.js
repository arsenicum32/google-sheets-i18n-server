const db = require('../infrastructure/db')
const sheetsClient = require('../infrastructure/sheetsClient')

const emptyToNull = (value) => (value === '' ? null : value)

const rowsToTranslations = (rows) => {
  if (!rows.length) {
    return {}
  }

  const headers = rows[0]
  const languages = headers.slice(1)
  const values = rows.slice(1)

  return values.reduce((acc, row) => {
    const key = row[0]
    const translations = row.slice(1)

    if (!key) {
      return acc
    }

    for (const lang of languages) {
      acc[lang] = acc[lang] || {}
      acc[lang][key] = emptyToNull(translations[languages.indexOf(lang)])
    }

    return acc
  }, {})
}

const flatToNested = (translations) =>
  Object.entries(translations).reduce((acc, [key, value]) => {
    const parts = key.split('.')
    let cursor = acc

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value
      } else {
        cursor[part] = cursor[part] || {}
        cursor = cursor[part]
      }
    })

    return acc
  }, {})

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