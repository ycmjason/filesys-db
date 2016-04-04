var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#findOne', function(){
    var db, collection;
    beforeEach(function(){
      db = DB.clearInstances();
      collection = db.createCollection('cars');
    });

    it('should create an entry in collection and find it', function(done){
      collection.put({model: 'N444', color: 'rainbow'}, function(){
        collection.findOne({model: 'N444'}, function(car){
          assert.deepEqual(car, {model: 'N444', color: 'rainbow'});
          db.dropCollection('cars');
          done();
        });
      });
    });

    it('should find null for non existing object', function(done){
      collection.findOne({a:'123'}, function(car){
        assert(!car);
        done();
      });
    });

    afterEach(function(){
      db.dropCollection('cars');
    });

  });

};
