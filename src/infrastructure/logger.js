const write = (level, message, meta = {}) => {
  console.log(JSON.stringify({
    level,
    message,
    time: new Date().toISOString(),
    ...meta,
  }))
}

module.exports = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
}