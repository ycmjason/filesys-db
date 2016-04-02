var fs = require('fs');
var Database = require('./lib/Database');

module.exports = function(path){
  path = path || './filesys-db/';
  return new Database(path);
};
