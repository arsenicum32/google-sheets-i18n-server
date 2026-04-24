import config from '../config.js'

export default {
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    }
  },

  ready() {
    return {
      status: config.googleApiKey ? 'ready' : 'not_ready',
      checks: {
        googleApiKey: Boolean(config.googleApiKey),
      },
    }
  },
}
