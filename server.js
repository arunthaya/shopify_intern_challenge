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
	res.send({body: temp});
});

app.post('/api/world', (req, res) => {
	console.log(req.body);
	res.send(
		`I received your POST request. This is what you sent me: ${req.body.post}`,
	);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);

});