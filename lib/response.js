function getExt(path) {
	var lastIndex = path.lastIndexOf('.');
	var ext;

	if(~lastIndex) {
		ext = path.slice(lastIndex + 1);
	}

	return ext;
}

function checkCache(cache, name, options) {
	if(cache[name] && cache[name][String(options)]) {
		return cache[name][String(options)];
	}

	return false;
}

function addToCache(cache, name, options, rendered) {

	cache[name] = cache[name] || {};

	cache[name][String(options)] = rendered;
}

function Response(app) {
	this.app = app;

	this.views = app.get('views') || '/views';
	this.defaultExt = app.get('view engine');
	this.caching = app.get('view cache');
	this.cache = app.view_cache;
	this.engines = app.engines;
	this.viewport = app.viewport;

	this.router = app.router;

	return this;
}

Response.prototype.render = function(name, context) {
	return this.renderer.render(name, context);
};

Response.prototype.render = function(path, options, callback) {
	var cached,
		caching = this.caching,
		cache = this.cache,
		viewport = this.viewport,
		ext,
		engine;

	if(path[0] !== '/') {
		path = this.views + '/' + path;
	}

	ext = getExt(path);

	if(!ext) {
		path = path + '.' + this.defaultExt;
		ext = this.defaultExt;
	}

	cached = caching ? checkCache(cache, path, options) : false;

	if(cached) {

		viewport.html(cached);

	} else {

		engine = this.engines[ext];

		engine(path, options, function(err, rendered) {
			if(err) {
				callback(err);
				return;
			}

			if(caching) {
				addToCache(cache, path, options, rendered);
			}

			viewport.html(rendered);	
		});
	}
};

Response.prototype.redirect = function(url) {
	if(url.slice(0, 4) === 'http') {
		window.location = url;
		return;
	}
	if(url === 'back') {
		this.router.back();
		return;
	}
	if(url[0] === '/') {
		this.router.trigger({
			method: 'get',
			path: url
		});
		return;
	}

	this.router.trigger({
		method: 'get',
		path: this.router.currentRoute().path + url
	});
};

module.exports = Response;