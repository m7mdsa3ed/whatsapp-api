const VenomService = require("../Venom");

exports.postAppCreated = () => {
  if (eval(process.env.AUTO_CREATED_SESSIONS)) {
    VenomService.createConnectionInstances();
  } 
};
