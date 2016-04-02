var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#find', function(){
    it('should create an entry in collection and find it', function(done){
      var db = DB();
      var collection = db.createCollection('cars');
      collection.put({model: 'N444', color: 'rainbow'}, function(){
        collection.find({model: 'N444'}, function(cars){
          assert.deepEqual(cars[0], {model: 'N444', color: 'rainbow'});
          db.dropCollection('cars');
          done();
        });
      });
    });

    it('should create a few entry in collection and find some', function(done){
      var db = DB();
      var collection = db.createCollection('cars');
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
        collection.put(dummy_cars, function(){
          collection.find({color: 'blue'}, function(cars){
            assert.deepEqual(cars, [{model: 'N392', color: 'blue'},
                             {model: 'N893', color: 'blue'},
                             {model: 'N293', color: 'blue'}]);
                             db.dropCollection('cars');
                             done();
          });
        });
    });

    it('should read entry from an already existing collection', function(done){
      var db = DB();
      var collection = db.createCollection('cars');
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
        collection.put(dummy_cars, function(){
          db = DB(); // recreate db instance to read from file
          db.getCollection('cars').find({model: 'N000'}, function(car){
            assert.deepEqual(car[0], {model: 'N000', color: 'rainbow'});
            db.dropCollection('cars');
            done();
          });
        });
    });

  });
};
