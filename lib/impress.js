var Router = require('./router');

var Response = require('./response');
var Request = require('./request');

var $ = require('jquery-joules');


function Impress() {

	var app = this;

	// random string id
	this.id = Math.random().toString(36).slice(2);

	// settings (getter and setter for private data)
	var settings = {};

	this.set = function(name, value) {
		settings[name] = value;
	};

	var get = function(name) {
		return settings[name];
	};

	// rendering engines
	this.engines = {};

	// view cache
	this.view_cache = {};

	// set up our renderer
	// viewport is just a div
	this.viewport = $('<div id="'+this.id+'"></div>');

	$(document.body).append(this.viewport);


	// router
	var router = this.router = new Router();
	this.routes = router.routes;
	var route = router.route;

	// replace the route callback with a wrapper that provides access to req and res
	router.route = function(path, verb, fn, options) {

		route.call(router, path, verb, function(params, body) {

			var req = new Request(verb, params, body);

			var res = new Response(app);

			fn(req, res);

		}, options);
	};

	// copy over the essential methods as methods of our app
	['route', 'get', 'post', 'put', 'delete'].forEach(function(methodName) {
		app[methodName] = router[methodName].bind(router);
	});

	// app.get is used for settings and for GET
	var routerGet = app.get;

	app.get = function(name_or_path, null_or_callback) {
		if(arguments.length > 1) {
			routerGet.apply(app, Array.prototype.slice.call(arguments));
			return;
		}
		return get(name_or_path);
	};

	// start capturing on page actions
	router.captureEvents();

	return this;
}

Impress.prototype.engine = function(ext, callback) {
	this.engines[ext] = callback;
};


module.exports = Impress;