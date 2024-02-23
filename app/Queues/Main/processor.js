const processor = async (job) => {
  const { data } = job

  const handlerPath = data.handler;

  const handler = require(`${basePath}/${handlerPath}`);

  data.payload.handlerName = data.handler
  
  await handler(data.payload)
  
  return true;
}

module.exports = processor