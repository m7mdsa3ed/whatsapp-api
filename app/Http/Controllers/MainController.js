const venomService = require('../../Services/Venom')
const {dispatcher, queue} = require('../../Queues/Main')
const dayjs = require('dayjs')
const WhatsAppService = require("../../Services/Whatsapp");
const QuoteService = require("../../Services/Quotes");

exports.connect = async (req, res) => {
  const {connectionName, force} = req.body || {}

  if (!connectionName) {
    return res.json({
      message: "Connection name is missing",
    })
  }

  const results = await venomService[force ? "makeConnection" : "getConnection"](connectionName)

  if (results.status === "CONNECTED") {
    return res.json({
      status: "OK",
      message: "Connected",
    })
  }

  return res.json(results)
}

exports.renderQR = async (req, res) => {
  const imageName = req.params.name

  const baseURL = '/storage'

  const path = `${baseURL}/${imageName}`

  res.render('view', {path})
}

exports.connections = async (req, res) => {
  const connections = await venomService.getConnection();

  res.json({
    connections: connections.map(connection => ({
      connectionName: connection.connectionName,
      status: connection.status,
    }))
  })
}

exports.getMessages = async (req, res) => {
  const messages = await WhatsAppService.findAllLogs();

  return res.json(messages);
}

exports.sendMessage = async (req, res) => {
  const {connectionName, number, message} = req.body || {};

  if (typeof number == 'undefined' || typeof message == 'undefined') {
    return res.json({
      error: "Missing Params"
    })
  }

  try {
    const response = await venomService.sendMessage({connectionName, number, message})

    return res.json({
      response
    })

  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

exports.sendVoice = async (req, res) => {
  const {connectionName, number, filePath} = req.body || {};

  if (typeof number == 'undefined' || typeof filePath == 'undefined') {
    return res.json({
      error: "Missing Params"
    })
  }

  try {
    const response = await venomService.sendVoice({connectionName, number, filePath})

    return res.json({
      response
    })

  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

exports.scheduleMessage = (req, res) => {
  const {connectionName, number, message, at} = req.body || {};

  const payload = {
    handler: "app/Jobs/SendWhatsappMessage",
    payload: {
      connectionName,
      number,
      message,
    }
  }

  dispatcher(payload, {delay: dayjs(at).diff(dayjs())})

  res.json({
    message: 'Message Scheduled!'
  })
}

const parsePhoneNumbers = (numbers) => {
  if (typeof numbers === 'string') {
    numbers = numbers.split(',')
  }

  return numbers
    .map(number => {
      number = number.trim();

      // remove + and spaces and ( and ) and - and . and , and ; 
      number = number.replace(/[\s+()\-.,;]/g, '')

      // add egypt country code
      if (number.startsWith('01')) {
        number = `2${number}`
      }

      return number
    })
}

exports.saveQuote = async (req, res) => {
  const {quote, author} = req.body || {};

  if (!quote) {

    return req.isAjax()
      ? res.json({error: 'Missing Params'})
      : res.redirect('/')
  }

  const theQuote = await QuoteService.createQuote({quote, author});

  return req.isAjax()
    ? res.json({
      message: "Quote Saved!",
      quote: theQuote
    })
    : res.redirect('/')
}

exports.deleteQuote = async (req, res) => {
  const {id} = req.body || {};

  if (!id) {
    return req.isAjax()
      ? res.json({error: 'Missing Params'})
      : res.redirect('/')
  }

  await QuoteService.deleteQuote(id);

  return req.isAjax()
    ? res.json({error: 'Quote Deleted!'})
    : res.redirect('/')
}

exports.getQuotes = async (req, res) => {
  const quotes = await QuoteService.findAll();

  return res.json(quotes);
}

exports.getRandomQuote = async (req, res) => {
  let quote = await QuoteService.getRandomQuote();

  return res.json(quote);
}

exports.dailyQuote = async (req, res) => {
  const {connectionName, numbers, at} = req.body || {};

  const phoneNumbers = parsePhoneNumbers(numbers)

  const payload = {
    handler: "app/Jobs/ScheduledQuoteMessage",
    payload: {
      connectionName: connectionName || 'main',
      numbers: phoneNumbers,
    }
  }

  await dispatcher(payload, {delay: dayjs(at).diff(dayjs())})

  res.json({
    message: 'Daily Quote Scheduled!'
  })
}

exports.resetQueue = async (req, res) => {
  await queue.obliterate()

  return res.json({
    message: 'Queue obliterated'
  })
}
