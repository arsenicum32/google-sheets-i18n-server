import sheetsClient from '../infrastructure/sheetsClient.js'

export default {
  getMetrics() {
    return {
      cache: sheetsClient.getCacheStats(),
    }
  },
}
