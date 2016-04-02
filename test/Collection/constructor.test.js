var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#constructor', function(){
    it('should create Collection and check props', function(){
      var db = DB();
      var col = new Collection(db, 'car');
      assert.equal(col.name, 'car');
      assert.equal(col.path, './filesys-db/car.json');
      assert.deepEqual(col.documents, []);
      db = DB();
      db.dropCollection('car');
    });

    it('should create Collection and try recreate DB to get the Collection', function(){
      var db = DB();
      var col = new Collection(db, 'car');
      db = DB(); // recreate instance to see if db has that collection
      assert(db.getCollection('car'));
      db.dropCollection('car');
    });
  });

};
