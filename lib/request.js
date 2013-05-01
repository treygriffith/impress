function Request(app, params, body) {
	this.app = app;

	this.params = params || {};
	this.body = body || {};

	return this;
}

module.exports = Request;