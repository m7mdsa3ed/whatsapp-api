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

  const types = ['delayed', 'waiting', 'active', 'failed', 'completed'];

  const jobs = [];

  for (let i = 0; i < types.length; i++) {
    const type = types[i];

    const _jobs = await queue.getJobs([type]);

    jobs.push(_jobs.map(job => ({ job, type })))
  }

  res.json({
    jobs: jobs.flat(1).map(({ job, type }) => ({
      job,
      type: type.toUpperCase(),
      id: job.id,
      data: job.data,
      time: dayjs(job.timestamp).add(job.delay).format('LLL'),
    }))
  })
}