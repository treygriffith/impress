var Impress = require('./lib/impress');
var impressHogan = require('./view_engines/impress-hogan.js');

module.exports = function() {
	return new Impress();
};

module.exports.impressHogan = impressHogan;