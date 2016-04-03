
# File system database (filesys-db)
filesys-db is a database system that manages your json files on your file system. This package is meant to be lightweight and intuitive to use. 

## Installation
```
npm install --save filesys-db
```

## Data store
Data are stored as json files under the database base path, which can be easily configured. filesys-db is heavily influenced by MongoDB and used terms like documents, collections and databases. Below is a table explaining what they are, you should be quite familiar with them if you had experience in MongoDB.

Term        | RDBMS equivilent | Description
------------|------------------|-----------------------------------------------------------------------
Document    | Record           | Document is a list of datum.
Collection  | Table            | Collection groups a number of documents of usually the same type.
Database    | Database         | Database groups a number of Collection.

A simple example that would illustrate their relations well.
```
School (database)
 |-- Students (collection)
 |   |-- {"name": "Jason", "age": 21} (document)
 |   |-- {"name": "Margaret", "age": 18} (document)
 |-- Classrooms (collection)
 |   |-- {"room_number": "A3", "capacity": 40} (document)
 |   |-- {"room_number": "e03", "capacity": 100} (document)   
 |   |-- {"room_number": "308", "capacity": 32} (document)   
 |   |-- {"room_number": "B3", "capacity": 40} (document)
``` 

## Usage

###  Overview
This section is intended to describe how to perform database operations with filesys-db.
* Database (managing collections)
  * [Initialising **filesys-db**](#initialising-filesys-db)
  * [Creating **collections**](#creating-collections)
  * [Getting **collections**](#getting-collections)
  * [Removing **collections**](#removing-collections)
* Collection (managing documents)
  * [Inserting **documents**](#inserting-documents)
  * [Finding **documents**](#finding-documents)
  * [Updating **documents**](#updatingdocuments)
  * [Removing **documents**](#removing-documents)

### Database (managing collections)

#### Initialising filesys-db
* `require('filesys-db')([db_base_path]);`
  * `db_base_path` by default is `'./filesys-db/'`
  * synchronous method

#### Creating collections
* `db.createCollection(collection_name);`
  * `collection_name` is unique to the database; meaning that no duplication would be allowed.  
  * synchronous method

#### Getting collections
* `db.getCollection(collection_name)`
  * synchronous function
  
### Collection (managing documents)
After reproducing the school-db data model, we could try querying, manipulating and removing the data.

#### Inserting documents
* `collection.put(document, [callback])`
  * document is only guaranteed to be inserted inside the callback function body.
  * **asynchronous method**

#### Removing collections
* `db.dropCollection(collection_name);`
  * synchronous function

#### Finding documents
* `collection.find(query, [callback]);`
  * `query` can be of type (`Array`|`Function`|`Object`|`string`)
  * used lodash's [`_.filter`](https://lodash.com/docs#filter) function
  * synchronous function (recommend to use callback)
* `collection.findOne(query, callback);`
  * `query` can be of type (`Array`|`Function`|`Object`|`string`)
  * used lodash's [`_.find`](https://lodash.com/docs#find) function
  * synchronous function (recommend to use callback)

#### Updating documents
* `collection.update(query, update, [callback]);`
  * `query`|`update` can be of type (`Array`|`Function`|`Object`|`string`)
  * used lodash's [`_.filter`](https://lodash.com/docs#filter) function
  * queried documents will inherits `update`'s properties if update is an object
  * if `update` is a function, each queried document will be passed into update and update should have it's property updated.
  * final documents will be passed to the `callback`
  * **asynchronous method**

#### Removing documents
* `collection.remove(query, [callback]);`
  * `query` can be of type (`Array`|`Function`|`Object`|`string`)
  * used lodash's [`_.filter`](https://lodash.com/docs#filter) function
  * **asynchronous function**

## School database example
The [school database example](#data-store) can be quickly reproduced with filesys-db:

We can use the nodejs interactive shell for this.
```
bash> node
```
```js
> var db = require('filesys-db')('./school-db/');
```
>in this example, we store our json files in `./school-db/`.

The database is now initialised. Let's create the collections.
```js
> var students = db.createCollection('students');
> var classrooms = db.createCollection('classrooms');
```

Let's insert some students data into the students collection.
```js
> students.put({"name": "Jason", "age": 21}, function(){
...   students.put({"name": "Margaret", "age": 18});
... });
```
>Note: we **should not** execute the two `put` without any of them nested in other's call back. Collections operations are asynchronous.

To avoid *callback hell*, we could actually put multiple documents into a collection all at once.
```js
> classrooms.put([{"room_number": "A3", "capacity": 40},
                  {"room_number": "e03", "capacity": 100},
                  {"room_number": "308", "capacity": 32},                  
                  {"room_number": "B3", "capacity": 40}]);
```
---
Now we have everything set. The principle of the school ordered us to change something on the database. 
However before any change, we have to obtain the reference to the collections. It is actually very simple with just few lines of code:
```js
// connects to school-db
var db = require('filesys-db')('./school-db/');
// get the references to students and classrooms collections
var students   = db.getCollection('students');
var classrooms = db.getCollection('classrooms');
```

Now let's say we want to find the classrooms that have capacity >= 40 and the room has exactly capacity=40.
```js
classrooms.find(function(classroom){
  return classroom.capacity >= 40;
}, function(classrooms){
  console.log(classrooms);
});
/* Result: [ { room_number: 'A3', capacity: 40 },
           { room_number: 'e03', capacity: 100 },
           { room_number: 'B3', capacity: 40 } ] */
classrooms.find({capacity: 40}, function(classrooms){
  console.log(classrooms);
});
/* Result: [ { room_number: 'A3', capacity: 40 },
           { room_number: 'B3', capacity: 40 } ] */
```
Let's say we want to find out how old is Margaret. We could do the following.
```js
students.findOne({name: "Margaret"}, function(margaret){
  console.log(margaret.age);
});
// Result: 18
```

The school is reconstructed and all rooms have their capacity increased by 20%. Let's see how are we going to reflect this on filesys-db.
```js
classrooms.update({}, function(classroom){
  classroom.capacity *= 1+20%;
}, function(classrooms){
  console.log(classrooms);
});
/* Result: [{"room_number": "A3", "capacity": 48},
            {"room_number": "e03", "capacity": 120},
            {"room_number": "308", "capacity": 38.4},                  
            {"room_number": "B3", "capacity": 48}] */
```
Let's have another example, classrooms with `capacity` > 100 are donated by "John". To reflect this:
```js
classrooms.update(function(classroom){
  return classroom>100;
}, {donator: 'John'}, function(classrooms){
  console.log("John has donated these classrooms:");
  console.log(classrooms);
})
```

Margaret has pissed Jason off one day and Jason has decided to hack into the school-db and delete Margaret from the database. He ran the following scripts to do so.
```js
students.remove({name: 'Margaret'}, function(){
  console.log("no more margaret!");
});
```

## Testing
```bash
npm run test
```

## To do ideas
* binary that interacts with database
  * e.g. `fsdb collection ls` -> `collection1`, `collection2`, `collection3`...
* refactor tests

## License
MIT
