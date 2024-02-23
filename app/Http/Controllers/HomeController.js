const dayjs = require('dayjs')
dayjs.extend(require('dayjs/plugin/localizedFormat'))

const getJobs = async () => {
  const {queue} = require('../../Queues/Main')

  const types = ['delayed', 'waiting', 'active', 'failed', 'completed'];

  const jobs = [];

  for (let i = 0; i < types.length; i++) {
    const type = types[i];

    const _jobs = await queue.getJobs([type]);

    jobs.push(_jobs.map(job => ({job, type})))
  }

  return jobs.flat(1).map(({job, type}) => ({
    name: job.name,
    type: type.toUpperCase(),
    id: job.id,
    data: job.data,
    time: dayjs(job.timestamp).add(job.delay).format('LLL'),
  }))
}

exports.index = async (req, res) => {
  const quotes = await require('../../Services/Quotes').findAll();
  
  res.render('index', {
    jobs: await getJobs(),
    quotes,
  });
}

exports.getJobs = async (req, res) => {
  res.json({
    jobs: await getJobs(),
  })
}

exports.deleteJob = async (req, res) => {
  const {queue} = require('../../Queues/Main')

  const {id} = req.body;

  const job = await queue.getJob(id);

  if (job) {
    await job.remove();
  }

  return res.redirect('/');
}