const Queue = require('bull') ;
const processor = require('./processor')

const mainQueue = new Queue('main')

mainQueue.process(processor)

const dispatcher = (payload, options) => {
  mainQueue.add(payload, options)
}

module.exports = {
  dispatcher,
  mainQueue
}