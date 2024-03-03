const WhatsAppMessagesLog = require("../../Models/Message");

exports.createLogMessage = async (payload) => {
  return await WhatsAppMessagesLog.create({
    ...payload,
  });
};

exports.findAllLogs = async () => {
  return WhatsAppMessagesLog.find();
};