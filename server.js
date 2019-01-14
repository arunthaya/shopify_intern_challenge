const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const port = process.env.PORT || 5000
const url = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const dbpath = process.env.MONGODB_DB || 'shopifychallenge'
require('custom-env').env()
let mongodb

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, 'client/build')))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

app.get('/api/search', (req, res) => {
  let mongoQuery = {
    $text: { $search: req.query.keywords }
  }
  mongodb.collection('wasteresources').find(mongoQuery).toArray(function (err, result) {
    if (err) {
      res.send(err)
      throw err
    }
    let response = { body: result }
    res.send(response)
  })
})

app.listen(port, () => {
  MongoClient.connect(url, function (err, db) {
    if(err){
      res.send(err)
      throw err
    }
  	console.log('Connected correctly to db')
	  mongodb = db
  })
  console.log(`Listening on port ${port}`)
})
