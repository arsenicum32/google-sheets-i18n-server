import { send, json } from 'micro'
import microCors from 'micro-cors'
import { router, get, post } from 'microrouter'

import routes from './routes.js'
import handler from './api/handler.js'

import projectService from './services/projectService.js'
import translationService from './services/translationService.js'
import metricsService from './services/metricsService.js'
import healthService from './services/healthService.js'

const cors = microCors({
  allowMethods: ['GET', 'POST'],
})

export default cors(
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

    get('/', (_req, res) => send(res, 200, { status: 'ok' })),
    get('/*', (_req, res) => send(res, 404, { error: 'Not found' })),
  ),
)

