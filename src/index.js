require('dotenv').config()

const microCors = require('micro-cors')
const { send, json } = require('micro')
const { router, get, post } = require('microrouter')

const routes = require('./routes')
const handler = require('./api/handler')
const projectService = require('./services/projectService')
const translationService = require('./services/translationService')
const metricsService = require('./services/metricsService')

const cors = microCors({
  allowMethods: ['GET', 'POST'],
})

module.exports = cors(
  router(
    get(
      routes.METRICS,
      handler(() => metricsService.getMetrics()),
    ),

    get(
      routes.PROJECTS,
      handler(() => projectService.getProjects()),
    ),

    post(
      routes.PROJECTS,
      handler(async (req) => {
        const body = await json(req)
        return projectService.saveProject(body)
      }),
    ),

    get(
      routes.GET_TRANSLATE,
      handler(({ params, query }) =>
        translationService.getFlat({
          project: params.pid,
          lang: params.lang,
          tag: query.tag,
        }),
      ),
    ),

    get(
      routes.GET_LANG_BY_GAME,
      handler(({ params, query }) =>
        translationService.getStructured({
          project: params.pid,
          lang: params.lang,
          tag: query.tag,
        }),
      ),
    ),

    get('/', (req, res) => send(res, 200, { status: 'ok' })),
    get('/*', (req, res) => send(res, 404, { error: 'Not found' })),
  ),
)