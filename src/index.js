require('dotenv').config()

const microCors = require('micro-cors')
const { send, json } = require('micro')
const { router, get, post } = require('microrouter')

const routes = require('./routes')
const handler = require('./api/handler')

const projectService = require('./services/projectService')
const translationService = require('./services/translationService')
const metricsService = require('./services/metricsService')
const healthService = require('./services/healthService')

const cors = microCors({
  allowMethods: ['GET', 'POST'],
})

module.exports = cors(
  router(
    get(routes.HEALTH, handler(() => healthService.health())),
    get(routes.READY, handler(() => healthService.ready())),
    get(routes.METRICS, handler(() => metricsService.getMetrics())),

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
      routes.PROJECT_TRANSLATIONS,
      handler(({ params, query }) =>
        translationService.getTranslationsResponse({
          project: params.project,
          lang: params.lang,
          tag: query.tag || 'master',
          format: query.format || 'nested',
        }),
      ),
    ),

    get('/', (req, res) => send(res, 200, { status: 'ok' })),
    get('/*', (req, res) => send(res, 404, { error: 'Not found' })),
  ),
)