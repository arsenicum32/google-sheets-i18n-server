const { googleApiKey } = require('../config')

module.exports = {
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    }
  },

  ready() {
    return {
      status: googleApiKey ? 'ready' : 'not_ready',
      checks: {
        googleApiKey: Boolean(googleApiKey),
      },
    }
  },
}