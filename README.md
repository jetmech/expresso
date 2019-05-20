# Expresso

## :earth_americas: Overview
This is the solution I came up with to pass the tests provided.

I used a number of classes that represent the different objects in the database. Each class has
instance and static methods used to access and manipulate the database. Error checking of properties is done
using ES6 setters and I store the private data in a Weakmap using the instance (this) as the key.

The class methods return promises and there are also custom errors that I have used to simplify error handling.
The routes use promise.then.catch style coding and the catch will forward the error to the hander using the next() method.

There is a simple config file that sets the database path depending on the NODE_ENV variable. It's the test database all the time
unless NODE_ENV=production.

You'll find all the routing and class code in the lib directory.

Also, the webpack output is part of the .gitignore so you'll have to build it yourself if you want to run the app. Alternatively,
you can just grab the public js file from the .zip that we're given at the start of the project.

## :clipboard: Instructions

Have a look in package.json to see what scripts are available.

The usual npm install will install the packages as well as setting up the database. The postinstall script calls migration.js automatically.
````bash
npm install
````

There are a few test specific scripts as well.
For example, running the following will test the models and silence the usual node warnings:
````bash
npm run test-model --silent
````

## :books: Documentation

I used JSDoc to coment throughout and have turned that into documentation. Refer to the docs directory if you'd like to see what's there.

## :vertical_traffic_light: Tests

Each class has associated tests. Run npm test for everything or look at package.json for the specific tests.

## :zap: Starting the Server

The usual node start script will set NODE_ENV=production and start the server as per express best practices for deployment.
````bash
npm start
````

## :bug: Bugs

There may be bugs in my code so let me know.

I updated mocha and after that the tests would hang as the server was left open.
As per the mocha documentation I added a line to close that.

Refer to the following commit for more info:
https://github.com/jetmech/expresso/commit/fd17ef99171f89460c2fffff0e64885a6b98ddeb

A also noticed that some tests had a mixture of promisies and callback functions.
As per the mocha documentation I fixed that too:
https://github.com/jetmech/expresso/commit/558a8a3c835db0890586f8a0a58d55780acce71e

## :boom: This repository

This repository is a bit of a mess. Normally I have borderline OCD with my commits but I've been flat out with my normal job
and have been doing this project in my small ammounts of spare time. Sorry about the that!

## :smile_cat: Thanks! :smile_cat:

Finally, thanks for taking the time to review this project! I certainly learnt a lot and I'm looking forward to the next course.
