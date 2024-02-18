const {Queue, Worker} = require('bullmq');
const processor = require('./processor')
const ioredis = require('ioredis')

const connection = {
  host: '127.0.0.1',
  port: 6379
};

const queue = new Queue('main', {
  connection
})

const dispatcher = async (payload, options) => {
  const jobName = payload.jobName ?? 'job-' + Date.now()
  
  await queue.add(jobName, payload, options)
}

new Worker('main', processor, {
  connection
})

module.exports = {
  dispatcher,
  queue
}