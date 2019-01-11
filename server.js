const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const testJson = require('./wasteresources.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});