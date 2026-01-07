import { describe, it, expect, vi, beforeEach } from 'vitest'
import Cache from '../src/infrastructure/cache.js'

describe('Cache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('deduplicates concurrent requests', async () => {
    const cache = new Cache({ ttlMs: 1000 })
    const fetcher = vi.fn(async () => 'value')

    const [a, b, c] = await Promise.all([
      cache.get('key', fetcher),
      cache.get('key', fetcher),
      cache.get('key', fetcher),
    ])

    expect(a).toBe('value')
    expect(b).toBe('value')
    expect(c).toBe('value')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('returns fresh cached value without calling fetcher again', async () => {
    const cache = new Cache({ ttlMs: 1000 })
    const fetcher = vi.fn(async () => 'value')

    await cache.get('key', fetcher)
    const result = await cache.get('key', fetcher)

    expect(result).toBe('value')
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(cache.getStats().hit).toBe(1)
  })

  it('returns stale value and refreshes in background', async () => {
    const cache = new Cache({
      ttlMs: 1000,
      staleTtlMs: 10_000,
    })

    const fetcher = vi
      .fn()
      .mockResolvedValueOnce('old')
      .mockResolvedValueOnce('new')

    await cache.get('key', fetcher)

    vi.advanceTimersByTime(1500)

    const result = await cache.get('key', fetcher)

    expect(result).toBe('old')
    expect(fetcher).toHaveBeenCalledTimes(2)

    await Promise.resolve()

    const refreshed = await cache.get('key', fetcher)

    expect(refreshed).toBe('new')
  })

  it('returns stale value when background refresh fails', async () => {
    const logger = {
      warn: vi.fn(),
    }

    const cache = new Cache({
      ttlMs: 1000,
      staleTtlMs: 10_000,
      logger,
    })

    const fetcher = vi
      .fn()
      .mockResolvedValueOnce('old')
      .mockRejectedValueOnce(new Error('Google Sheets error'))

    await cache.get('key', fetcher)

    vi.advanceTimersByTime(1500)

    const result = await cache.get('key', fetcher)

    expect(result).toBe('old')
    expect(fetcher).toHaveBeenCalledTimes(2)

    await Promise.resolve()

    const fallback = await cache.get('key', fetcher)

    expect(fallback).toBe('old')
    expect(logger.warn).toHaveBeenCalled()
  })

  it('throws error when there is no cached value', async () => {
    const cache = new Cache({ ttlMs: 1000 })
    const fetcher = vi.fn(async () => {
      throw new Error('Google Sheets error')
    })

    await expect(cache.get('key', fetcher)).rejects.toThrow('Google Sheets error')
    expect(cache.getStats().error).toBe(1)
  })

  it('normalizes object keys', async () => {
    const cache = new Cache({ ttlMs: 1000 })
    const fetcher = vi.fn(async () => 'value')

    await cache.get({ project: 'app', lang: 'en' }, fetcher)
    await cache.get({ project: 'app', lang: 'en' }, fetcher)

    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})

