var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#remove', function(){
    it('should create an entry in collection and remove it', function(done){
      var db = DB.clearInstances();
      var collection = db.createCollection('cars');
      collection.put({model: 'N444', color: 'rainbow'}, function(){
        collection.remove({model: 'N444'}, function(){
          assert.deepEqual(collection.documents.length, 0);
          db.dropCollection('cars');
          done();
        });
      });
    });

    it('should create many entry from and remove some', function(done){
      var db = DB.clearInstances();
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
        var dummy_cars_without_red = [{model: 'N444', color: 'rainbow'},
                                      {model: 'N392', color: 'blue'},
                                      {model: 'N893', color: 'blue'},
                                      {model: 'N293', color: 'rainbow'},
                                      {model: 'N000', color: 'rainbow'},
                                      {model: 'N293', color: 'brown'},
                                      {model: 'N293', color: 'blue'}];
        collection.put(dummy_cars, function(){
          db = DB.clearInstances(); // recreate db instance to read from file
          db.getCollection('cars').remove({color: 'red'}, function(){
            assert.deepEqual(db.getCollection('cars').documents, dummy_cars_without_red);
            db.dropCollection('cars');
            done();
          });
        });
    });

    it('should create an entry in collection and remove it and find it in callback', function(done){
      var db = DB.clearInstances();
      var collection = db.createCollection('cars');
      collection.put({model: 'N444', color: 'rainbow'}, function(){
        collection.remove({model: 'N444'}, function(cars){
          assert.deepEqual(cars[0].model, 'N444');
          assert.deepEqual(cars[0].color, 'rainbow');
          db.dropCollection('cars');
          done();
        });
      });
    });
  });

};
