const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const port = process.env.PORT || 5000
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbpath = process.env.MONGODB_DB || 'shopifychallenge'
const https = require('https')
const log4js = require('log4js');
require('custom-env').env()
let mongodb


/**
 * Configuring the log4js file to save content to an external file for later examination
 */
log4js.configure({
  appenders: {
    server: { type: 'file', filename: 'log.log' }
  },
  categories: {
    default: { appenders: [ 'server' ], level: 'INFO' }
  }
});

const logger = log4js.getLogger('server')

/**
 * Function to initially connect to MongoDB, any errors will be returned, otherwise mongodb object saved for later use
 * @param {String} url - Supplied url from .env file or defaults to original one
 */
MongoClient.connect(url, function (err, db) {
  if(err){
    logger.error(`Error connecting to MongoClient initially: ${err}`)
    return console.log(err)
  }
  mongodb = db.db(dbpath);
})

app.use((req,res, next) => {
  ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress
  logger.info(req.method + ' request received from : '+ip)
  next()
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
  if(req.query.keywords) logger.info(`request being made to term: ${req.query.keywords}`)
  let mongoQuery = {
    $text: { $search: req.query.keywords } //Using MongoDB's text function to search for related keywords
  }
  let response = {}
  let queryAttributes = {
    body: true,
    title: true,
  } //queryAttributes specified for needed attributes from MongoDB, optimizes search
  try {
    if (mongodb) {
      mongodb.collection('wasteresources').find(mongoQuery)
      .project(queryAttributes).toArray(function (err, result) {
        if (err) { //error connecting to db or error with db
          console.log(`error connecting to MongoDB from req ${err}`)
          logger.error(err)
          response = { error: 'Error connecting to MongoDB'}
          return setTimeout(() => res.status(500).send(response), 250) //delay by 250ms simulating real life server
        }
        response = { body: result }
        setTimeout(() => res.send(response), 250)
      })
    } else {
      logger.fatal('Mongodb null, no connection initially established')
      res.status(500).send({error: 'Error establishing initial connection to MongoDB'})
    }
  } catch (e) { //initial connection with mongodb not successful
    console.log(e)
    logger.error(`error connecting to MongoDB in catch block ${err}`)
    response = { error: 'Error establishing initial connection to MongoDB'}
    res.status(500).send(response)
  }
})


/**
 * Hosts a server that is listening on the specified port, and constantly pings heroku app to leave it up and running on free tier (24/7)
 * @param {Integer} port - Used as the port to host the server
 */
const server = app.listen(port, () => {
  setInterval(function(){
    https.get("https://shopifywebchallengearun.herokuapp.com/")
  }, 900000) //pings url every 15 minutes
  console.log(`Listening on port ${port}`)
})

/**
 * Looks for different process events and gracefully ends node.js along with the logger, flushing all contents to a file
 * @param {Object} 'eventType' - Looking for certain event types to write to file, and close server and MongoDB con. if needed
 */

process.stdin.resume()
process
  .on('unhandledRejection', (reason, p) => {
    logger.warn(reason, 'Unhandled rejection at promise p', p)
  })
  .on('uncaughtException', err => {
    logger.fatal(err, 'Uncaught Exception thrown.')
  })
  .on('SIGTERM', ()=> {
    server.close(() => {
      logger.fatal('Process exited by SIGTERM')
      log4js.shutdown(() => {
        if (mongodb) mongodb.close()
        process.exit(0)
      })
    })
  })
  .on('SIGINT', ()=> {
    server.close(() => {
      logger.warn('Process exited by SIGINT')
      log4js.shutdown(() => {
        if (mongodb) mongodb.close()
        process.exit(0)
      })
    })
  })
  .on('SIGQUIT', ()=> {
    server.close(() => {
      logger.warn('Process exited by SIGQUIT')
      log4js.shutdown(() => {
        if (mongodb) mongodb.close()
        process.exit(1)
      })
    })
  })
