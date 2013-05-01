var History = require('history.js-joules');
var $ = require('jquery-joules');
var Route = require('./route');
var qs = require('qs');


function routesMatch(route, currentRoute) {
	if(route.method === currentRoute.method) {
		if(route.match(currentRoute.path)) {
			return true;
		}
	}
}

function Router() {
	var router = this;

	this.host = window.location.protocol + '//' + window.location.host;

	this.routes = {
		get: [],
		post: [],
		put: [],
		'delete': []
	};

	History.replaceState({method: 'get'}, '', History.getState().url.slice(this.host.length));

	History.Adapter.bind(window, 'statechange', function() {
		router.dispatch(router.currentRoute());
	});

	return this;
}

Router.prototype.captureEvents = function() {
	var router = this;

	$(document).on('submit', 'form', function(e) {
		e.preventDefault();

		var body = {};

		$(this).find('input, select, textarea').filter('[name]').each(function() {
			if($(this).attr('type') === 'radio' || $(this).attr('type') === 'checkbox') {
				if(!$(this).is(':checked')) {
					return;
				}
			}
			body[$(this).attr('name')] = $(this).val();
		});

		router.trigger({
			method: $(this).attr('method') || 'GET',
			path: $(this).attr('action') || router.currentRoute().path
		}, body);
	});

	$(document).on('click', 'a', function(e) {
		e.preventDefault();

		router.trigger({
			method: 'GET',
			path: $(this).attr('href')
		});
	});
};

Router.prototype.back = function() {
	History.back();
};

Router.prototype.trigger = function(route, body) {
	var method = route.method.toLowerCase();
	var path = route.path;

	History.pushState({method: method, body:body}, '', path);
};

Router.prototype.triggerRedirect = function(route, body) {
	var method = route.method.toLowerCase();
	var path = route.path;

	History.replaceState({method: method, body:body}, '', path);
};

Router.prototype.dispatch = function(route) {
	var method = route.method.toLowerCase();
	var path = route.path;
	var body = route.body;



	var routes = this.routes[method];

	routes.forEach(function(route) {
		if(route.match(path)) {
			route.callbacks(route.params, body);
		}
	});
};

Router.prototype.currentRoute = function() {
	var state = History.getState();
	return {
		path: state.url.slice(this.host.length),
		method: state.data.method || 'get',
		body: state.data.body || {}
	};
};

Router.prototype.route = function(path, method, fn, options) {
	method = method.toLowerCase();

	var route = new Route(method, path, fn, options);

	this.routes[method].push(route);

	if(routesMatch(route, this.currentRoute())) {
		fn(route.params);
	}
};

Router.prototype.get = function(path, fn) {
	this.route(path, 'get', fn);
};

Router.prototype.post = function(path, fn) {
	this.route(path, 'post', fn);
};

Router.prototype.put = function(path, fn) {
	this.route(path, 'put', fn);
};

Router.prototype['delete'] = function(path, fn) {
	this.route(path, 'delete', fn);
};

module.exports = Router;