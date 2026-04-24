import db from '../infrastructure/db.js'

const isValidProjectName = (name) => /^[a-zA-Z0-9_-]+$/.test(name)

export const createProjectService = (projectDb) => ({
  getProjects() {
    return projectDb.get()
  },

  async saveProject({ name, value }) {
    if (!name || !value) {
      throw new Error('Project name and spreadsheet id are required')
    }

    if (!isValidProjectName(name)) {
      throw new Error('Project name may contain only letters, numbers, "_" and "-"')
    }

    return projectDb.set(name, value)
  },
})

export default createProjectService(db)
