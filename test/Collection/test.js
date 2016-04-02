var assert = require('assert');
var fs = require('fs');
var checkCollection = function(collection, name, path, data){
  assert.equal(collection.name, name);
  assert.equal(collection.path, path);
  assert.deepEqual(collection.documents, data);
  assert.equal(fs.statSync(path).isFile(), true);
  return true;
};

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
