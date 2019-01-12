const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const testJson = require('./wasteresources.json');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const port = process.env.PORT || 5000;
const url= process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbpath = process.env.MONGODB_DB || 'shopifychallenge';
const client = new MongoClient(url);
require('custom-env').env();
let mongodb;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.get('/api/search', (req, res) => {
	let mongoQuery = {
		$text: { $search: req.query.keywords}
	};
	mongodb.collection("wasteresources").find(mongoQuery).toArray(function(err, result) {
    if (err) {
			console.log('here');
			res.send(err);
			throw err;
		};
		let response = {body: result};
		res.send(response);
  });
});

app.listen(port, () => {
	MongoClient.connect(url, function(err, db) {
	  console.log("Connected correctly to server");
	  mongodb = db.db('heroku_r30zcvb0');
	});
	console.log(`Listening on port ${port}`);
});
