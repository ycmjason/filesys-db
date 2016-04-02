var assert = require('assert');
var fs = require('fs');
var checkCollection = function(collection, name, path, data){
  assert.equal(collection.name, name);
  assert.equal(collection.path, path);
  assert.deepEqual(collection.documents, data);
  assert.equal(fs.statSync(path).isFile(), true);
  return true;
};

describe('Database', function(){
  require('./constructor.test')();
  require('./createCollection.test')(checkCollection);
  require('./getCollection.test')(checkCollection);
  require('./dropCollection.test')(checkCollection);

  after(function(){
    try{ //try to clean up after test
      fs.unlinkSync('./filesys-db/cars.json');
      fs.unlinkSync('filesys-db/animals.json');
      fs.unlinkSync('filesys-db/animals2.json');
      fs.unlinkSync('filesys-db/animals3.json');
      fs.unlinkSync('filesys-db/animals4.json');
      fs.unlinkSync('filesys-db/animals5.json');
      fs.unlinkSync('filesys-db/' + encodeURIComponent('sensitive/aha$ ;; , / ? : @ & = + $#') + '.json');
      var created_dirs = ['./filesys-db', './custom_db', './custom_db2'];
      created_dirs.forEach(function(dir){
        fs.rmdirSync(dir); 
      });
    }catch(e){}
  });
});
