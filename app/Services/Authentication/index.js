const AccessKey = require("../../Models/AccessKey");
const bcrypt = require('bcryptjs');

const createRandomKey = async () => {
  const uuid = crypto.randomUUID();

  return await bcrypt.hash(uuid, 5);
};

exports.generateAccessToken = async () => {
  return await AccessKey.create({
    key: await createRandomKey(),
  });
};
