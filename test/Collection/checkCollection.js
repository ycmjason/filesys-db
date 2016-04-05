var assert = require('assert');
var fs = require('fs'),
    p  = require('path');

var checkCollection = function(collection, name, path, data){
  assert.equal(collection.name, name);
  assert.equal('./'+p.relative(p.dirname(collection.path)+'/..', collection.path), path);
  assert.deepEqual(collection.documents, data);
  assert.equal(fs.statSync(path).isFile(), true);
  return true;
};
module.exports = checkCollection;
