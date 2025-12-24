export default class Cache {
  constructor({
    ttlMs = 5000,
    staleTtlMs = 60_000,
    logger = console,
  } = {}) {
    this.ttlMs = ttlMs
    this.staleTtlMs = staleTtlMs
    this.logger = logger

    this.items = new Map()

    this.stats = {
      hit: 0,
      miss: 0,
      stale: 0,
      refresh: 0,
      error: 0,
    }
  }

  normalizeKey(key) {
    if (typeof key === 'object' && key !== null) {
      return JSON.stringify(key)
    }

    return String(key)
  }

  isFresh(item) {
    return Date.now() - item.updatedAt < this.ttlMs
  }

  isStaleAvailable(item) {
    return Date.now() - item.updatedAt < this.staleTtlMs
  }

  async get(key, fetcher) {
    const cacheKey = this.normalizeKey(key)
    const item = this.items.get(cacheKey)

    if (item?.value && this.isFresh(item)) {
      this.stats.hit += 1
      return item.value
    }

    if (item?.promise) {
      this.stats.hit += 1
      return item.promise
    }

    if (item?.value && this.isStaleAvailable(item)) {
      this.stats.stale += 1
      this.refresh(cacheKey, key, fetcher)

      return item.value
    }

    this.stats.miss += 1

    return this.fetchAndStore(cacheKey, key, fetcher)
  }

  refresh(cacheKey, originalKey, fetcher) {
    const item = this.items.get(cacheKey)

    if (item?.promise) {
      return item.promise
    }

    this.stats.refresh += 1

    return this.fetchAndStore(cacheKey, originalKey, fetcher, {
      keepStaleOnError: true,
    })
  }

  async fetchAndStore(
    cacheKey,
    originalKey,
    fetcher,
    { keepStaleOnError = false } = {},
  ) {
    const previous = this.items.get(cacheKey)

    const promise = Promise.resolve()
      .then(() => fetcher(originalKey))
      .then((value) => {
        this.items.set(cacheKey, {
          value,
          promise: null,
          updatedAt: Date.now(),
        })

        return value
      })
      .catch((error) => {
        this.stats.error += 1

        if (keepStaleOnError && previous?.value) {
          this.items.set(cacheKey, {
            ...previous,
            promise: null,
          })

          this.logger.warn?.('cache_refresh_failed_returning_stale', {
            cacheKey,
            error: error.message,
          })

          return previous.value
        }

        this.items.delete(cacheKey)
        throw error
      })

    this.items.set(cacheKey, {
      value: previous?.value,
      promise,
      updatedAt: previous?.updatedAt || 0,
    })

    return promise
  }

  getStats() {
    return {
      ...this.stats,
      size: this.items.size,
      ttlMs: this.ttlMs,
      staleTtlMs: this.staleTtlMs,
    }
  }

  clear() {
    this.items.clear()
  }
}

