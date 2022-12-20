const dayjs = require('dayjs')
dayjs.extend(require('dayjs/plugin/localizedFormat'))

exports.index = (req, res) => {
  res.json({
    message: "WhatsApp API",
    status: "WIP"
  })
}

exports.getJobs = async (req, res) => {
  const { queue } = require('../../Queues/Main')

  const jobs = await queue.getJobs(['delayed', 'waiting', 'active'])

  const jobCounts = await queue.getJobCounts();

  res.json({
    jobs: jobs.map(job => ({
      id: job.id,
      data: job.data,
      time: dayjs(job.timestamp).add(job.delay).format("LLL")
    }))
  })
}