var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');

module.exports = function(checkCollection){
  describe('#createCollection', function(){
    var db;
    before(function(){
      db=DB();
    });

    it('should create a cars collection in db, with correct properties and .json at fs', function(){
      db.createCollection('cars');
      assert.equal(db.collections.length, 1);
      assert(checkCollection(db.collections[0], 'cars', './filesys-db/cars.json', []));
    });

    it('should create another collection', function(){
      db.createCollection('animals');
      assert.equal(db.collections.length, 2);
      assert(checkCollection(db.collections[1], 'animals', './filesys-db/animals.json', []));
    });

    it('should create many collection', function(){
      db.createCollection('animals2');
      db.createCollection('animals3');
      db.createCollection('animals4');
      db.createCollection('animals5');
      assert.equal(db.collections.length, 6);
      assert(db.collections[5], 'animals5', './filesys-db/animals5.json', []);
    });

    it('should create collection with sensitive char name', function(){
      db.createCollection('sensitive/aha$ ;; , / ? : @ & = + $#');
      assert.equal(db.collections.length, 7);
      var encodedname = encodeURIComponent('sensitive/aha$ ;; , / ? : @ & = + $#');
      assert(db.collections[6], encodedname, './filesys-db/'+encodedname+'.json', []);
    });

    it('should try to create collections with duplicated names and throw error', function(){
      assert.throws(() =>{
        db.createCollection('animals');
        db.createCollection('animals');
      }, /Collection name conflicts/);
    });


    after(function(){
      fs.unlinkSync('./filesys-db/cars.json');
      fs.unlinkSync('filesys-db/animals.json');
      fs.unlinkSync('filesys-db/animals2.json');
      fs.unlinkSync('filesys-db/animals3.json');
      fs.unlinkSync('filesys-db/animals4.json');
      fs.unlinkSync('filesys-db/animals5.json');
      fs.unlinkSync('filesys-db/' + encodeURIComponent('sensitive/aha$ ;; , / ? : @ & = + $#') + '.json');
      fs.rmdirSync("./filesys-db"); 
    });
  });
};
