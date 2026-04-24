import { send } from 'micro'

const handler = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res)
    send(res, 200, result)
  } catch (error) {
    const statusCode = error.statusCode || 500

    send(res, statusCode, {
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    })
  }
}

export default handler
