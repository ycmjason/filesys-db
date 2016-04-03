var fs = require('fs');
var _ = require('lodash');
var utils = require('./utils');

function Collection(database, name){
  this.name = name = encodeURIComponent(name); // avoid bad naming
  this.path = database.path + name + ".json";
  
  try{
    this.documents = JSON.parse(fs.readFileSync(this.path));
  }catch(err){
    if(err.code != "ENOENT") throw err;
    this.documents = [];
    this.saveSync();
  }
}

Collection.prototype.findOne = function(query, cb){
  found = utils.cloneObject(_.find(this.documents, query));
  if(cb) cb(found);
  return found;
};

Collection.prototype.find = function(query, cb){
  found = utils.cloneObject(_.filter(this.documents, query));
  if(cb) cb(found);
  return found;
};

Collection.prototype.put = function(doc, cb){
  this.documents = _.concat(this.documents, utils.cloneObject(doc));
  this.save(cb);
};
Collection.prototype.update = function(query, update, cb){
  if(!query || !update) throw Error("no query or update given");
  var to_be_edited_docs = _.filter(this.documents, query);
  if(to_be_edited_docs.length <= 0) return cb(null);
  to_be_edited_docs.forEach((to_be_edited_doc) => {
    if(_.isFunction(update)){
      update(to_be_edited_doc);
    }else{
      _.extend(to_be_edited_doc, update);
    }
  });
  this.save(function(){
    if(cb) cb(utils.cloneObject(to_be_edited_docs));
  });
};

Collection.prototype.remove = function(query, cb){
  var to_be_removed_docs = _.filter(this.documents, query);
  _.pullAll(this.documents, to_be_removed_docs);
  this.save(cb);
};

Collection.prototype.save = function(callback){
  fs.writeFile(this.path, JSON.stringify(this.documents), (err) => {
    if(err) throw err;
    if(callback) callback();
  });
};
Collection.prototype.saveSync = function(){
  fs.writeFileSync(this.path, JSON.stringify(this.documents));
};

module.exports = function(database, name){
  return new Collection(database, name);
};
