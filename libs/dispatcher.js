const Queue = require('bull') ;
const processor = require('./processor')

const scheduler = new Queue('scheduler')

scheduler.process(processor)

const dispatcher = (payload, options) => {
  scheduler.add(payload, options)
}

module.exports = dispatcher