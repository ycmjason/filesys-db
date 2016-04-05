var assert = require('assert');
var fs = require('fs'),
    p  = require('path');
var checkCollection = require('./checkCollection');

describe('Collection', function(){
  require('./constructor.test')();
  require('./put.test')();
  require('./findOne.test')();
  require('./find.test')();
  require('./remove.test')();
  require('./update.test')();

  afterEach(function(){
    var created_dirs = ['./filesys-db'];
    created_dirs.forEach(function(dir){
      fs.rmdirSync(dir); 
    });
  });
});
