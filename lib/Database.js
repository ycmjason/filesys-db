var fs = require('fs'),
    utils = require('./utils'),
    Collection = require('./Collection');
    _ = require('lodash');

function Database(path){
  if(!path) throw new Error("Initiate Database without given path");
  this.path = path = path[path.length - 1] == '/'? path: path+'/';

  (function(){
    var files = [];
    try{
      files = fs.readdirSync(path);
    }catch(err){
      if(err.code != 'ENOENT') throw err;
      if(err.code == 'ENOENT'){
        try{
          fs.mkdirSync(path);
        } catch(err){
          throw err; // Please make sure the path exists.
        }
      }
    }
    this.collections = files.map((name) => {
      return new Collection(this, utils.getFilename(name));
    });
  }).call(this);
  
}

Database.prototype.getCollection = function(name){
  name = encodeURIComponent(name);
  var collection = this.collections.filter((collection) => collection.name == name);
  return collection.length>0? collection[0]: null;
};

Database.prototype.createCollection = function(name){
  if(this.getCollection(name)){
    throw new Error('Collection name conflicts. Are you trying to create a collection of name already exist?');
  }

  var collection = new Collection(this, name);
  this.collections.push(collection);
  return collection;
};

Database.prototype.dropCollection = function(name){
  var collection = this.getCollection(name);
  if(collection){
    // drop collection from collections
    this.collections = this.collections.filter((c) => c.name != collection.name);
    // remove collection from filesystem
    fs.unlinkSync(collection.path);
  }
  return true;
};

module.exports = function(database, path){
  return new Database(database, path);
};
