var assert = require('assert');
var fs = require('fs');
var DB = require('../../filesys-db');

module.exports = function(){
  describe('#constructor', function(){
    describe('()', function(){
      it('should create a filesys-db directory at .', function(){
        var db = DB();
        assert.equal(fs.statSync('./filesys-db').isDirectory(), true);
      });
      it('recreation of DB find the Collections', function(){
        var db = DB();
        db.createCollection('car');
        db = DB();
        assert(db.getCollection('car'));
        db.dropCollection('car');
      });
    });

    describe('(custom_path)', function(){
      it('should create a custom_db directory at .', function(){
        var db = DB('custom_db');
        assert.equal(fs.statSync('./custom_db').isDirectory(), true);
      });
      it('should create a custom_db directory at .', function(){
        var db = DB('./custom_db2');
        assert.equal(fs.statSync('./custom_db2').isDirectory(), true);
      });
    });


    after(function(){
      var created_dirs = ['./filesys-db', './custom_db', './custom_db2'];
      created_dirs.forEach(function(dir){
        fs.rmdirSync(dir); 
      });
    });

  });
};
