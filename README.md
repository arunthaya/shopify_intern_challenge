### Shopify Web Engineer Summer Internship Challenge (2019)

This is my submission for the Shopify Web Engineer Internship Challenge. This web app allows users to quickly search the database to retrieve information regarding proper waste disposal. This web app uses React as a front-end framework and Node.js and MongoDB as the backend. I chose to use Node.js and MongoDB as a backend to showcase my ability to work with backends and make the frontend and backend communicate seamlessly.

[Hosted link]()
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
