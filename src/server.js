import 'dotenv/config'
import { createServer } from 'http'
import config from './config.js'
import app from './index.js'

const server = createServer(app)

server.listen(config.port, '0.0.0.0', () => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'server_started',
    port: config.port,
    time: new Date().toISOString(),
  }))
})
