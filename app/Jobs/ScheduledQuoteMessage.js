const venomService = require('../Services/Venom');
const {dispatcher} = require("../Queues/Main");
const dayjs = require("dayjs");
const QuotesService = require("../Services/Quotes");

const job = async (payload) => {
  const {connectionName, numbers, handlerName} = payload

  const quoteMessage = await getQuoteMessage()

  if (quoteMessage) {
    for (const number of numbers) {
      try {
        await venomService.sendMessage({connectionName, number, message: quoteMessage})
      } catch (error) {
        console.error({error})
      }

      // sleep random time between 1 and 5 seconds
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5) * 1000))
    }
  }

  await dispatchAgainAfterOneDay(handlerName, payload)
}

const getQuoteMessage = async () => {
  return await QuotesService.getRandomQuote()
}

const getRandomOneFromQuoteApi = async () => {
  const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
    headers: {
      'X-Api-Key': process.env.API_NINJAS_API_KEY,
    }
  })

  const data = await response.json()

  const quote = data[0]?.quote;

  const author = data[0]?.author;

  return `${quote} - ${author}`
}

const dispatchAgainAfterOneDay = async (handler, payload) => {
  const next = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')

  const nextJobPayload = {
    handler,
    payload
  }

  await dispatcher(nextJobPayload, {
    delay: dayjs(next).diff(dayjs(), 'millisecond')
  })
}

module.exports = job