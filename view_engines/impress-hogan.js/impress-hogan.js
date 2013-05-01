var fs = require('./utils/fs-browser'),
	hogan = require('hogan.js');

function render(name, options, callback) {
	if(!callback) {
		callback = options;
		options = {};
	}

	var context = options.locals || {};

	fs.readFile(name, 'utf8', function(err, contents) {
		if(err) {
			callback(err);
			return;
		}

		var template = hogan.compile(contents);

		callback(null, template.render(context));
	});
}

module.exports = render;