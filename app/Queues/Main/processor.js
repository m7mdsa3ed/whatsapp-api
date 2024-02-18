const processor = async (job, done) => {
  const { data } = job

  const handlerPath = data.handler;

  const handler = require(`${basePath}/${handlerPath}`);

  data.payload.handlerName = data.handler
  
  await handler(data.payload)

  done()
}

module.exports = processor