var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');

module.exports = function(){
  describe('#dropCollection', function(){
    var db;

    var dropCollectionAndCheck = function(name){
      var beforeCount = db.collections.length;
      db.dropCollection(name);
      assert.equal(db.collections.length, beforeCount - 1);
      assert.throws(() => {
        fs.statSync('./filesys-db/' + name + '.json');
      }, function(err){
        return err.code == 'ENOENT';
      });
      return true;
    };

    before(function(){
      db=DB.clearInstances();
    });

    it('should create a collection then drop it', function(){
      db.createCollection('cars');
      assert(dropCollectionAndCheck('cars'));
    });

    it('should create another collection then trying to drop both', function(){
      db.createCollection('cars');
      db.createCollection('animals');
      assert(dropCollectionAndCheck('animals'));
      assert(dropCollectionAndCheck('cars'));
    });

    it('should create many collection and drop all', function(){
      db.createCollection('animals2');
      db.createCollection('animals3');
      db.createCollection('animals4');
      db.createCollection('animals5');
      assert(dropCollectionAndCheck('animals2'));
      assert(dropCollectionAndCheck('animals5'));
      assert(dropCollectionAndCheck('animals4'));
      assert(dropCollectionAndCheck('animals3'));
    });

    it('should create collection with sensitive char name and drop it', function(){
      var sensitive_name = 'sensitive/aha$ ;; , / ? : @ & = + $#';
      db.createCollection(sensitive_name);
      var encodedname = encodeURIComponent(sensitive_name);
      assert(dropCollectionAndCheck(sensitive_name));
    });

    it('should try to drop non existing collection then expect return true', function(){
      assert.equal(db.dropCollection('non-existing'), true);
    });

    after(function(){
      fs.rmdirSync("./filesys-db"); 
    });
  });
};
