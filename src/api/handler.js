const { send } = require('micro')

const handler = (fn) => async (req, res) => {
  try {
    const result = await fn(req)
    send(res, 200, result)
  } catch (error) {
    send(res, 400, {
      error: error.message,
    })
  }
}

module.exports = handler