const Message = require("../../Models/Message");

exports.createMessage = async (payload) => {
  return await Message.create({
    ...payload,
  });
};

exports.findAll = async () => {
  return await Message.findAll();
};