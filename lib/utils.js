exports.getFilename = function(filename){
  return filename.substring(0, filename.lastIndexOf('.'));
};
exports.cloneObject = function(obj){
  return JSON.parse(JSON.stringify(obj));
};
