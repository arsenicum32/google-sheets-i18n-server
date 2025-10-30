import { google } from 'googleapis'
import config from '../config.js'

const sheets = google.sheets({
  version: 'v4',
  auth: config.googleApiKey,
})

export default {
  getRows(params) {
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get(params, (error, response) => {
        if (error) {
          reject(error)
          return
        }

        resolve(response?.data?.values || [])
      })
    })
  },
}

