"use strict";
var fs = require('fs');
var Database = require('./lib/Database');

var existing_instances = {};

module.exports = function(name){
  name = name || 'filesys-db';
  var path = __dirname + '/' + name;

  if(!existing_instances[path]){
    existing_instances[path] = new Database(path);
  }

  return existing_instances[path];
};

// for testing purposes, should not really be used
module.exports.clearInstances = function(path){
  existing_instances = {};
  return module.exports(path);
};
