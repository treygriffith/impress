var impress = require('impress');

var impressHogan = impress.impressHogan;

var app = impress();

app.set('views', '/views');

app.set('view engine', 'html');

app.engine('html', impressHogan);

app.get('/', function(req, res) {
	res.render('index');
});

// this will be triggered whenever a user clicks on a link to '/a_username'
app.get('/:user_id', function(req, res) {

	// this will render into a div on-screen
	res.render('my_template', {
		locals: {
			user_id: req.params.user_id
		}
	});
});

app.post('/', function(req, res) {
	res.redirect('/' + req.body.user_id);
});