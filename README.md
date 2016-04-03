
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
``` 
## Usage examples
### Reproduce the school database
The above example can be quickly reproduced using filesys-db:

First we get into node interactive shell by:
```
bash> node
```
Then we initialise filesys-db. 
```js
> var db = require('filesys-db')('./school-db/');
```
>`'./school-db/'` is provided so that filesys-db knows where to store your json files. 
>By default, `./filesys-db/` would be used if no path is given.

The database is now ready; and we can create collections with it.
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
>Here notice that we **should not** execute the two `put` without the use of call back. This is because collections operations are asynchronous. 

To avoid *callback hell*, we could actually put multiple documents into a collection all at once.
```js
> classrooms.put([{"room_number": "A3", "capacity": 40},
                  {"room_number": "e03", "capacity": 100},
                  {"room_number": "308", "capacity": 32}]);
```

