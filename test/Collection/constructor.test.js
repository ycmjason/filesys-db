var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');
var checkCollection = require('./checkCollection');

module.exports = function(){
  describe('#constructor', function(){
    it('should create Collection and check props', function(){
      var db = DB.clearInstances();
      var col = new Collection(db, 'car');
      checkCollection(col, 'car', './filesys-db/car.json', []);
      db = DB.clearInstances();
      db.dropCollection('car');
    });

    it('should create Collection and try recreate DB to get the Collection', function(){
      var db = DB.clearInstances();
      var col = new Collection(db, 'car');
      db = DB.clearInstances(); // recreate instance to see if db has that collection
      assert(db.getCollection('car'));
      db.dropCollection('car');
    });
  });

};
