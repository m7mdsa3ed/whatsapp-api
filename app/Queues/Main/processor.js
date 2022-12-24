const processor = async (job, done) => {
  const { data } = job

  const handlerPath = data.handler;

  const handler = require(`${basePath}/${handlerPath}`);

  await handler(data.payload)

  done()
}

module.exports = processor