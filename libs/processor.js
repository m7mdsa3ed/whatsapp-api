const processor = ({ data }, done) => {
  const handlerPath = data.handler;

  const handler = require(`${basePath}/${handlerPath}`);

  handler(data.payload)

  done()
}

module.exports = processor