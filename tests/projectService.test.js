import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProjectService } from '../src/services/projectService.js'

describe('projectService', () => {
  let db
  let projectService

  beforeEach(() => {
    db = {
      get: vi.fn(),
      set: vi.fn(),
    }

    projectService = createProjectService(db)
  })

  describe('getProjects', () => {
    it('returns all projects', async () => {
      db.get.mockResolvedValue({
        app: 'sheet-id-1',
      })

      const result = await projectService.getProjects()

      expect(result).toEqual({
        app: 'sheet-id-1',
      })

      expect(db.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('saveProject', () => {
    it('creates new project', async () => {
      db.set.mockResolvedValue({ action: 'created' })

      const result = await projectService.saveProject({
        name: 'app',
        value: 'sheet-id',
      })

      expect(result).toEqual({ action: 'created' })
      expect(db.set).toHaveBeenCalledWith('app', 'sheet-id')
    })

    it('updates existing project', async () => {
      db.set.mockResolvedValue({ action: 'updated' })

      const result = await projectService.saveProject({
        name: 'app',
        value: 'sheet-id',
      })

      expect(result).toEqual({ action: 'updated' })
      expect(db.set).toHaveBeenCalledWith('app', 'sheet-id')
    })

    it('throws if name is missing', async () => {
      await expect(
        projectService.saveProject({
          value: 'sheet-id',
        }),
      ).rejects.toThrow('Project name and spreadsheet id are required')
    })

    it('throws if value is missing', async () => {
      await expect(
        projectService.saveProject({
          name: 'app',
        }),
      ).rejects.toThrow('Project name and spreadsheet id are required')
    })

    it('rejects invalid project name', async () => {
      await expect(
        projectService.saveProject({
          name: 'bad name!',
          value: 'sheet-id',
        }),
      ).rejects.toThrow('Project name may contain only letters')
    })

    it('accepts valid project name', async () => {
      db.set.mockResolvedValue({ action: 'created' })

      await projectService.saveProject({
        name: 'app_123-test',
        value: 'sheet-id',
      })

      expect(db.set).toHaveBeenCalledWith('app_123-test', 'sheet-id')
    })
  })
})
