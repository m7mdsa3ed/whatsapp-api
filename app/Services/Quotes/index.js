const Quote = require("../../Models/Quote");

exports.createQuote = async (payload) => {
  return await Quote.create({
    ...payload
  });
};

exports.findAll = async () => {
  return Quote.find();
};

exports.find = async (quoteId) => {
  const quote = Quote.findById(quoteId);

  console.log({quote, quoteId});

  return quote;
}

exports.getRandomQuote = async () => {
  const quotes = await Quote
    .aggregate()
    .sample(1)
    .exec();

  if (!quotes.length) {
    return {};
  }

  return quotes[0];
}

exports.inceaseQuoteViews = (quoteId) => {
  return Quote
    .findOneAndUpdate(
      {_id: quoteId},
      {$inc: {views: 1}},
    )
    .exec();
}