var path = require('path');
var express = require('express');
var app = express();
app.use(express.static(path.join(__dirname, '/api')));

app.set('port', 8081);

app.get('/api/account/profile', (req, res) => {
	res.send({name: 'Austin', userId: '155'});
});

app.listen(app.get('port'), () => console.info('Server listening on port 8081...'));