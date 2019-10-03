# LAB - Class 14

## User Management and Auth

### Phil Fitch

### Links and Resources
* [submission PR](http://xyz.com)
* [travis](http://xyz.com)
* [back-end](http://xyz.com) (when applicable)
* [front-end](http://xyz.com) (when applicable)

#### Documentation
* [api docs](http://xyz.com) (API servers)
* [jsdoc](http://xyz.com) (Server assignments)
* [styleguide](http://xyz.com) (React assignments)

### Setup
#### `.env` requirements
* `PORT` - 3000
* `MONGODB_URI` - URL to the running mongo instance/db

**or, include an `.env.example`**

#### Running the app


  pretest = npm run lint

  test = npm run jest

  start = node server.js


available via `npm run-script`:

  lint = eslint .

  jest = jest --runInBand --verbose

  test:coverage = npm run test -- --coverage

  test:watch = npm run jest -- --watchAll

  test:verbose = npm run test -- --verbose

  start:watch = nodemon server.js
  

#### Tests
Any additional testing information

#### UML
Link to an image of the UML for your application and response to events


Models
You need to create two models for this exercise:

User - represents a user account
Needs to store the hash from password
Needs to have a method to validate correct password
Has a favorites property this is an Array of ObjectId with a ref to Model #2 below
Some entity the user can favorite. Can be cats, pirates, or whatever you want
Include an owner property of type ObjectId with a ref to User model
Routes
Implement the standard auth router. Feel free to add in-class work to your template!

POST /api/auth/signup
POST /api/auth/signin
GET /api/auth/verify
Provide a "me" router:

GET /api/me/favorites
Populate favorites on user model
Return favorites property as response
PUT /api/me/favorites/<id-to-favorite>
"Add to Set" id to user favorites
Return new favorites array from user model
DELETE /api/me/favorites/<id-to-delete>
"Pull" id from user favorites
Return new favorites array from user model
Provide a router for your entity (cats in this example)

POST /api/cats
Add the authenticated user's id as the owner property
PUT and DELETE /api/cats/:id
In addition to the :id, limit to owner who is authenticated user
GET /api/cats
List of all cats, any authenticated user can access.