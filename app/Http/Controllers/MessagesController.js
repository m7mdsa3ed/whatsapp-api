const MessageService = require('../../Services/Messages');

exports.toggleMessageActiveStatus = async (req, res) => {
  const { id: messageId, isActive } = req.body;
  
  if (!messageId) {
    return res.json({error: 'Missing Params'});
  }
  
  const message = await MessageService.toggleMessageActiveStatus(messageId, isActive);

  return res.redirect('/');
}