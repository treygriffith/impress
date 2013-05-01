function Request(method, params, body) {
	body = body || {};
	params = params || {};

	this.params = params;
	this.body = {};
	this.query = {};

	if(method.toLowerCase() === 'get') {
		this.query = body;
	} else {
		this.body = body;
	}

	return this;
}

module.exports = Request;