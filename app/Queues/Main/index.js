const Queue = require('bull') ;
const processor = require('./processor')

const queue = new Queue('main')

queue.process(processor)

const dispatcher = (payload, options) => {
  queue.add(payload, options)
}

module.exports = {
  dispatcher,
  queue
}