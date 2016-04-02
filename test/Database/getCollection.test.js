var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');

module.exports = function(checkCollection){
  describe('#getCollection', function(){
    var db;
    before(function(){
      db=DB();
    });

    it('should create a collection then try getting it', function(){
      db.createCollection('cars');
      assert(checkCollection(db.getCollection('cars'), 'cars', './filesys-db/cars.json', []));
    });

    it('should create another collection then trying to get both', function(){
      db.createCollection('animals');
      assert(checkCollection(db.getCollection('cars'), 'cars', './filesys-db/cars.json', []));
      assert(checkCollection(db.getCollection('animals'), 'animals', './filesys-db/animals.json', []));
    });

    it('should create many collection and get all', function(){
      db.createCollection('animals2');
      db.createCollection('animals3');
      db.createCollection('animals4');
      db.createCollection('animals5');
      assert(checkCollection(db.getCollection('animals5'), 'animals5', './filesys-db/animals5.json', []));
      assert(checkCollection(db.getCollection('animals3'), 'animals3', './filesys-db/animals3.json', []));
      assert(checkCollection(db.getCollection('animals2'), 'animals2', './filesys-db/animals2.json', []));
      assert(checkCollection(db.getCollection('cars'), 'cars', './filesys-db/cars.json', []));
      assert(checkCollection(db.getCollection('animals4'), 'animals4', './filesys-db/animals4.json', []));
    });

    it('should create collection with sensitive char name and get it', function(){
      var sensitive_name = 'sensitive/aha$ ;; , / ? : @ & = + $#';
      db.createCollection(sensitive_name);
      var encodedname = encodeURIComponent(sensitive_name);
      assert(checkCollection(db.getCollection(sensitive_name), encodedname, './filesys-db/'+encodedname+'.json', []));
    });

    it('should try to get non existing collection then expect return null', function(){
      assert.equal(db.getCollection('non-existing'), null);
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
