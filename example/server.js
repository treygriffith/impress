var express = require('express');
var joules = require('joules');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(app.router);

joules.hint(__dirname + '/public', function(err) {
	if(err) throw err;
});

app.get('*', function(req, res) {
	fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, contents) {
		if(err) {
			res.send(err);
			return;
		}

		res.type('html');
		res.send(contents);
	});
});

app.listen(3000);
console.log("listening on 3000");