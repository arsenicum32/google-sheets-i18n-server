export default {
  port: process.env.PORT || 7996,
  googleApiKey: process.env.AUTH_KEY,
  tablesPath: process.env.TABLES_PATH || 'tables.txt',
}

