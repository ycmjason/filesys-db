var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');
var Collection = require('../../lib/Collection');

module.exports = function(){
  describe('#update', function(){
    var db;
    beforeEach(function(done){
      db = DB.clearInstances();
      var cars = db.createCollection('cars');
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
        cars.put(dummy_cars, function(){
          done();          
        });
    });

    it('should update an entry', function(done){
      var collection = db.getCollection('cars');
      collection.update({model: 'N444'}, {color: 'black', price: '$2039'}, function(newcars){
        assert.deepEqual(newcars[0], {model: 'N444', color: 'black', price: '$2039'});
        var db2 = DB.clearInstances();
        assert.deepEqual(db2.getCollection('cars').findOne({model: 'N444'}),
                         {model: 'N444', color: 'black', price: '$2039'});
                         done();
      });
    });

    it('should update some entries', function(done){
      var collection = db.getCollection('cars');
      collection.update({color: 'rainbow'}, {color: 'black', price: '$2039'}, function(newcars){
        assert.deepEqual(newcars,
                         [{model: 'N444', color: 'black', price: '$2039'},
                           {model: 'N293', color: 'black', price: '$2039'},
                           {model: 'N000', color: 'black', price: '$2039'}]
                        );
        var db2 = DB.clearInstances();
        assert.deepEqual(db2.getCollection('cars').findOne({model: 'N444'}),
                         {model: 'N444', color: 'black', price: '$2039'});
                         done();
      });
    });
    it('should update some entries with function', function(done){
      var collection = db.getCollection('cars');
      collection.update({color: 'rainbow'}, function(car){
        car.color = car.color+'0'; 
      }, function(newcars){
        assert.deepEqual(newcars, [{model: 'N444', color: 'rainbow0'},
                                   {model: 'N293', color: 'rainbow0'},
                                   {model: 'N000', color: 'rainbow0'}]);
        var db2 = DB.clearInstances();
        assert.deepEqual(db2.getCollection('cars').findOne({model: 'N444'}),
                         {model: 'N444', color: 'rainbow0'});
                         done();
      });
    });

    afterEach(function(){
      db.dropCollection('cars');
    });

  });
};
