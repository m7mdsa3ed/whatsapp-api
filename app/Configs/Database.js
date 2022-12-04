const { DB_HOST, DB_PORT, DB_NAME, DB_URL } = process.env

module.exports = {
  host: DB_HOST,
  port: DB_PORT,
  dbName: DB_NAME,
  url: DB_URL
}