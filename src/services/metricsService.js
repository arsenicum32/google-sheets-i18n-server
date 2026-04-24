const sheetsClient = require('../infrastructure/sheetsClient')

module.exports = {
  getMetrics() {
    return {
      cache: sheetsClient.getCacheStats(),
    }
  },
}