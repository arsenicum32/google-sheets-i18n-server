const { google } = require('googleapis')
const {
  googleApiKey,
  cacheTtlMs,
  cacheStaleTtlMs,
} = require('../config')

const Cache = require('./cache')
const logger = require('./logger')

const sheets = google.sheets({
  version: 'v4',
  auth: googleApiKey,
})

const cache = new Cache({
  ttlMs: cacheTtlMs,
  staleTtlMs: cacheStaleTtlMs,
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

module.exports = {
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