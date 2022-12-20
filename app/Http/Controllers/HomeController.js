const dayjs = require('dayjs')

exports.index = (req, res) => {
  res.json({
    message: "WhatsApp API",
    status: "WIP"
  })
}

exports.getJobs = async (req, res) => {
  const { mainQueue } = require('../../../libs/mainQueue')

  const jobs = await mainQueue.getJobs(['delayed', 'waiting', 'active'])

  const jobCounts = await mainQueue.getJobCounts();

  res.json({
    jobs: jobs.map(job => ({
      id: job.id,
      data: job.data,
      time: dayjs(job.timestamp).add(job.delay)
    }))
  })
}