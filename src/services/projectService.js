const db = require('../infrastructure/db')

const isValidProjectName = (name) => /^[a-zA-Z0-9_-]+$/.test(name)

module.exports = {
  getProjects() {
    return db.get()
  },

  async saveProject({ name, value }) {
    if (!name || !value) {
      throw new Error('Project name and spreadsheet id are required')
    }

    if (!isValidProjectName(name)) {
      throw new Error('Project name may contain only letters, numbers, "_" and "-"')
    }

    return db.set(name, value)
  },
}