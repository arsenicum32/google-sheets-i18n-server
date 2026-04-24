import db from '../infrastructure/db.js'
import sheetsClient from '../infrastructure/sheetsClient.js'
import { rowsToTranslations, flatToNested } from './translationTransform.js'

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

export default {
  async getTranslationsResponse({ project, lang, tag, format = 'nested' }) {
    const translations = await getTranslations({ project, tag })
    const flat = translations[lang] || {}

    if (format === 'flat') {
      return flat
    }

    if (format === 'nested') {
      return flatToNested(flat)
    }

    throw new Error('Unsupported format. Use "flat" or "nested"')
  },
}
