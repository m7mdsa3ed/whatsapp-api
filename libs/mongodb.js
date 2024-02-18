const mongoose = require("mongoose");

const getConnectionURI = () => {
  const { host, port, dbName, url } = require('../app/Configs/Database')

  if (!!url) {
    return url
  }

  return `mongodb://${host}:${port}/${dbName}`
}

exports.connect = () => {
  const uri = getConnectionURI();

  mongoose.connect(uri);

  const db = mongoose.connection

  db.on('connecting', () => {
    console.log(`Connecting to DB: ${url}`);
  })

  db.on("connected", () => console.log('MongoDB Connected'));

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
}