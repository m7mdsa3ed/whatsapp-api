const Quote = require("../../Models/Quote");

exports.createQuote = async (payload) => {
  return await Quote.create({
    ...payload
  });
};

exports.deleteQuote = async (quoteId) => {
  return Quote.deleteOne({
    _id: quoteId
  });
}

exports.findAll = async () => {
  return Quote.find();
};

exports.find = async (quoteId) => {
  const quote = Quote.findById(quoteId);

  console.log({quote, quoteId});

  return quote;
}

exports.getRandomQuote = async () => {
  const quotes = await Quote.aggregate([
    {$group: {_id: null, minViews: {$min: "$views"}, doc: {$push: "$$ROOT"}}},
    {$unwind: "$doc"},
    {$match: {$expr: {$eq: ["$doc.views", "$minViews"]}}},
    {$sample: {size: 1}}
  ]);
  
  let quote = quotes[0] || null;
  
  if (!quote) {
    return {};
  }

  quote = quote.doc;
  
  await this.inceaseQuoteViews(quote._id);
  
  return quote;
}

exports.inceaseQuoteViews = (quoteId) => {
  return Quote
    .findOneAndUpdate(
      {_id: quoteId},
      {$inc: {views: 1}},
    )
    .exec();
}