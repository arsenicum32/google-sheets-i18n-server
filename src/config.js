export default {
  port: process.env.PORT || 7996,
  googleApiKey: process.env.AUTH_KEY,
  tablesPath: process.env.TABLES_PATH || 'tables.txt',

  cacheTtlMs: Number(process.env.CACHE_TTL_MS || 5000),
  cacheStaleTtlMs: Number(process.env.CACHE_STALE_TTL_MS || 60_000),
}
