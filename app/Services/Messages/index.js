const Message = require("../../Models/Quote");

exports.toggleMessageActiveStatus = async (messageId, isActive) => {
  return await Message
    .findOneAndUpdate(
      {_id: messageId},
      {$set: {isActive}},
    )
    .exec();
};
