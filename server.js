const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const port = process.env.PORT || 5000
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbpath = process.env.MONGODB_DB || 'shopifychallenge'
const https = require('https')
require('custom-env').env()
let mongodb

/**
 * Function to initially connect to MongoDB, any errors will be returned, otherwise mongodb object saved for later use
 * @param {String} url - Supplied url from .env file or defaults to original one
 */
MongoClient.connect(url, function (err, db) {
if(err){
  return console.log(err)
}
mongodb = db.db(dbpath);
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * If server detects production mode in .env variable it will host React files from the client/build directory
 * @param {String} NODE_ENV - Environment variable specified by node, can be 'production' or 'dev'
 */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

/**
 * Process all get requests to /api/search and returns results found from MongoDB
 * @param {Object} req - Incoming req from the client containing header file, and other client info
 * @param {Object} res - Outgoing res from the server that will send respones to client with status code and any errors or results
 */
app.get('/api/search', (req, res) => {
  let mongoQuery = {
    $text: { $search: req.query.keywords } //Using MongoDB's text function to search for related keywords
  }
  let response = {}
  let queryAttributes = {
    body: true,
    title: true,
  } //queryAttributes specified for needed attributes from MongoDB, optimizes search
  try {
    mongodb.collection('wasteresources').find(mongoQuery)
    .project(queryAttributes).toArray(function (err, result) {
      if (err) { //error connecting to db or error with db
        console.log(err)
        response = { error: 'Error connecting to MongoDB'}
        return setTimeout(() => res.send(500, response), 250) //delay by 250ms simulating real life server
      }
      response = { body: result }
      setTimeout(() => res.send(response), 250)
    })
  } catch (e){ //initial connection with mongodb not successful
    console.log(e)
    response = { error: 'Error establishing initial connection to MongoDB'}
    res.send(500, response)
  }
})


/**
 * Hosts a server that is listening on the specified port, and constantly pings heroku app to leave it up and running on free tier (24/7)
 * @param {Integer} port - Used as the port to host the server
 */
app.listen(port, () => {
  setInterval(function(){
    https.get("https://shopifywebchallengearun.herokuapp.com/")
  }, 900000) //pings url every 15 minutes
  console.log(`Listening on port ${port}`)
})
