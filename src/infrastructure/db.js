import { promises as fs } from 'fs'
import config from '../config.js'

const encoding = 'utf8'
const splitter = '='

const readProjects = async () => {
  try {
    const data = await fs.readFile(config.tablesPath, { encoding })
    const projects = new Map()

    for (const row of data.split('\n')) {
      const [key, value] = row.split(splitter)

      if (key && value) {
        projects.set(key.trim(), value.trim())
      }
    }

    return projects
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Map()
    }

    throw error
  }
}

const writeProjects = async (projects) => {
  const data = [...projects.entries()]
    .map(([key, value]) => `${key}${splitter}${value}`)
    .join('\n')

  await fs.writeFile(config.tablesPath, data, { encoding })
}

export default {
  async get(name) {
    const projects = await readProjects()

    if (name) {
      return projects.get(name)
    }

    return Object.fromEntries(projects)
  },

  async set(name, value) {
    const projects = await readProjects()

    if (!value) {
      const existed = projects.delete(name)
      await writeProjects(projects)

      return {
        action: existed ? 'deleted' : 'not_found',
      }
    }

    const existed = projects.has(name)

    projects.set(name, value)
    await writeProjects(projects)

    return {
      action: existed ? 'updated' : 'created',
    }
  },
}
