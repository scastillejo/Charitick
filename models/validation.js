let Org = require('./da-org');

module.exports.validateEntity = function(params){
  return new Promise(function(resolve, reject){
    Org.validateEntity(params, function(err, org){
      if(err) reject(err);
      if(org)
        resolve(true);
      else
        resolve(false);
    });
  });
}