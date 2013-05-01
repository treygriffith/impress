Impress
-------
Express in the browser!

Impress is an Express-like application framework for the browser. It doesn't make much sense, since Express is based on the HTTP request-response cycle, which isn't a great paradigm for front-end, but it was still cool to do.

What's Included
---------------
Impress ships with very basic Express functionality. It can't (as of right now) do middleware, which is really the bread and butter of express.

It also ships with an adapter for Hogan.js for use as a templating system. Hooking up new engines is easy.

How To
------

```javascript
	
	var impress = require('impress');

	var impressHogan = impress.impressHogan;
	
	var app = impress();

	app.set('views', '/templates');

	app.set('view engine', 'html')

	app.engine('html', impressHogan);

	// this will be triggered whenever a user clicks on a link to '/a_username'
	app.get('/:user_id', function(req, res) {

		// this will render into a div on-screen
		res.render('my_template', {
			locals: {
				user_id: req.params.user_id
			}
		});
	});
```