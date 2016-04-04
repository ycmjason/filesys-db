var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#findOne', function(){
    it('should create an entry in collection and find it', function(done){
      var db = DB.clearInstances();
      var collection = db.createCollection('cars');
      collection.put({model: 'N444', color: 'rainbow'}, function(){
        collection.findOne({model: 'N444'}, function(car){
          assert.deepEqual(car, {model: 'N444', color: 'rainbow'});
          db.dropCollection('cars');
          done();
        });
      });
    });

  });

};
