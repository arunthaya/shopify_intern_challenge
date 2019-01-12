const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const testJson = require('./wasteresources.json');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
let mongodb;
let url='mongodb://localhost:27017';
const client = new MongoClient(url);
require('custom-env').env();

client.connect(function(err) {
	if (err) throw 'Error connecting to db';
	mongodb = client.db('shopifychallenge');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/search', (req, res) => {
	console.log(req.query.keywords);
	//console.log('incoming request is: ');
	let mongoQuery = {
		$text: { $search: req.query.keywords}
	};
	//console.log(req);
	mongodb.collection("wasteresources").find(mongoQuery).toArray(function(err, result) {
    if (err) {
			console.log('here');
			res.send(err);
			throw err;
		};
  	//console.log(result);
    //
		let response = {body: result};
		console.log('success');
		res.send(response);
  });
});


app.get('/api/hello', (req, res) => {
	let temp = [];
	for(let i=0; i<4; i++){
		let temp2 = {};
		temp2 = testJson[i];
		temp2._id = i;
		temp.push(temp2);
	}
	let response = [1,2,3,4];
	setTimeout(
		() => res.send({body: temp}), 350);
});

app.post('/api/world', (req, res) => {
	console.log(req.body);
	res.send(
		`I received your POST request. This is what you sent me: ${req.body.post}`,
	);
});

if (process.env.NODE_ENV === 'production') {
	console.log('production');
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
		console.log('request came in with url ');
		console.log(req);
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {

	console.log(`Listening on port ${port}`);
});
