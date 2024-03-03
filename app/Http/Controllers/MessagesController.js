const MessageService = require('../../Services/Messages');

exports.toggleMessageActiveStatus = async (req, res) => {
  const messageId = req.body.id;
  
  if (!messageId) {
    return res.json({error: 'Missing Params'});
  }
}