class Cache {
  constructor({ ttlMs }) {
    this.ttlMs = ttlMs
    this.items = new Map()
  }

  normalizeKey(key) {
    return typeof key === 'object' ? JSON.stringify(key) : String(key)
  }

  get(key, fetcher) {
    const normalizedKey = this.normalizeKey(key)
    const cached = this.items.get(normalizedKey)
    const now = Date.now()

    if (cached && now - cached.createdAt < this.ttlMs) {
      return cached.value
    }

    const value = Promise.resolve(fetcher(key))

    this.items.set(normalizedKey, {
      value,
      createdAt: now,
    })

    value.catch(() => {
      this.items.delete(normalizedKey)
    })

    return value
  }

  clear() {
    this.items.clear()
  }
}

module.exports = Cache