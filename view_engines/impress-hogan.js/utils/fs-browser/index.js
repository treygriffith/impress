var path = require('../path-browser');

// xhr
function sendRequest(url, method, callback) {
	var req = createXMLHTTPObject();
	if (!req) return;
	req.open(method,url,true);
	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		callback(req);
	};
	if (req.readyState == 4) return;
	req.send();
}

var XMLHttpFactories = [
	function () {return new XMLHttpRequest();},
	function () {return new ActiveXObject("Msxml2.XMLHTTP");},
	function () {return new ActiveXObject("Msxml3.XMLHTTP");},
	function () {return new ActiveXObject("Microsoft.XMLHTTP");}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i=0;i<XMLHttpFactories.length;i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

// shim for fs functions
exports.readFile = function(name, encoding, callback) {
	if(!callback) {
		callback = encoding;
		encoding = 'utf8';
	}
	sendRequest(path.resolve(name), 'GET', function(req) {
		if(req.status !== 200 && req.status !== 304) {
			callback(new Error("File does not exist"));
			return;
		}
		callback(null, req.responseText);
	});
};
exports.exists = function(name, callback) {
	sendRequest(path.resolve(name), 'HEAD', function(req) {
		if(req.status === 200 || req.status === 304) {
			callback(true);
			return;
		}
		callback(false);
	});
};
exports.stat = function(name, callback) {
	exports.exists(path.resolve(name), function(exist) {
		if(!exist) {
			callback(new Error("File does not exist"));
		}
		callback(null, {
			isFile: function() {
				return true;
			},
			isDirectory: function() {
				return false;
			},
			isBlockDevice: function() {
				return false;
			},
			isCharacterDevice: function() {
				return false;
			},
			isSymbolicLink: function() {
				return false;
			},
			isFIFO: function() {
				return false;
			},
			isSocket: function() {
				return false;
			}
		});
	});
};