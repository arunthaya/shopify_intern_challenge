### Shopify Web Engineer Summer Internship Challenge (2019)

This is my submission for the Shopify Web Engineer Internship Challenge. This web app allows users to quickly search the database to retrieve information regarding proper waste disposal. This web app uses React as a front-end framework and Node.js and MongoDB as the backend. I chose to use Node.js and MongoDB as a backend to showcase my ability to work with backends and make the frontend and backend communicate seamlessly.

![Gif Recording](https://user-images.githubusercontent.com/25303677/51163075-83e40380-1866-11e9-9f22-78ca1f710e22.gif)

***

### Installation
Prerequisites:
[Node.js](https://nodejs.org/en/download/),
[MongoDB](https://www.mongodb.com/download-center/community),
[Yarn](https://www.npmjs.com/package/yarn)

Installation using Yarn:
```
yarn preinstall
yarn install
```
Replace <dbname> with the url of MongoDB running locally, by default MongoDB uses: "localhost:27017". This populates local MongoDB.

### Running (Install first)

Step 1:

Run MongoDB script to populate database. Replace <dbname> with name of database, i.e "localhost:27017/shopifychallenge"

```
mongo <dbname> loaderscript.js
```

Step 2:

Run the application using Yarn:

```
yarn start
```

### Architecture

![Architecture](https://user-images.githubusercontent.com/25303677/51163681-7c255e80-1868-11e9-837a-1d3be4a0ef47.png)

MVC - Model View Control pattern
  - MongoDB is the model, which is used to store all the entries from the wasteresources.json file into a database collection
    - MongoDB was used as it is optimized for quick and easy text retrieval using the new text command
    - The title and array of keywords are used as an index for quick retrieval
    - Only certain elements are projected back to client for optimization
  - Node.js is the controller that is used to route all API requests, log requests and deny bad requests
  - React is the View and will augment the client according to what the user clicks or types
