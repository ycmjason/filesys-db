var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#put', function(){
    it('should create an entry in collection', function(done){
      var db = DB();
      var collection = db.createCollection('cars');
      collection.put({model: 'N343', color: 'red'}, function(){
        assert.deepEqual(collection.documents[0], {model: 'N343', color: 'red'});
        db.dropCollection('cars');
        done();
      });
    });
    it('should create an entry in collection and the file should exist', function(done){
      var db = DB();
      var collection = db.createCollection('cars');
      collection.put({model: 'N343', color: 'red'}, function(){
        db = DB(); // recreate db instance to read from file
        assert.equal(db.collections[0].name, 'cars');
        assert.deepEqual(db.collections[0].documents[0], {model: 'N343', color: 'red'});
        db.dropCollection('cars');
        done();
      });
    });
    it('should create a few entries in collection and the file should exist', function(done){
      var db = DB();
      var dummy_cars = [{model: 'N444', color: 'rainbow'},
        {model: 'N392', color: 'blue'},
        {model: 'N312', color: 'red'},
        {model: 'N893', color: 'blue'},
        {model: 'N293', color: 'rainbow'},
        {model: 'N389', color: 'red'},
        {model: 'N000', color: 'rainbow'},
        {model: 'N923', color: 'red'},
        {model: 'N293', color: 'brown'},
        {model: 'N293', color: 'blue'},
        {model: 'N293', color: 'red'}];
        var collection = db.createCollection('cars');
        collection.put(dummy_cars, function(){
          db = DB(); // recreate db instance to read from file
          assert.equal(db.collections[0].name, 'cars');
          assert.deepEqual(db.collections[0].documents[0], {model: 'N444', color: 'rainbow'});
          assert.deepEqual(db.collections[0].documents, dummy_cars);
          db.dropCollection('cars');
          done();
        });
    });
  });

};
