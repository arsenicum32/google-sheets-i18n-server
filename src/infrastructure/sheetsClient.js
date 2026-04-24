import { google } from 'googleapis'
import config from '../config.js'
import Cache from './cache.js'
import logger from './logger.js'

const sheets = google.sheets({
  version: 'v4',
  auth: config.googleApiKey,
})

const cache = new Cache({
  ttlMs: config.cacheTtlMs,
  staleTtlMs: config.cacheStaleTtlMs,
  logger,
})

const fetchRows = (params) =>
  new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(params, (error, response) => {
      if (error) {
        reject(error)
        return
      }

      resolve(response?.data?.values || [])
    })
  })

export default {
  getRows(params) {
    return cache.get(params, fetchRows)
  },

  getCacheStats() {
    return cache.getStats()
  },

  clearCache() {
    cache.clear()
  },
}
