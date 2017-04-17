/* eslint-env node*/
/* eslint-disable no-console */
'use strict';

let path = require('path');
let express = require('express');
let app = express();
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.set('port', 8081);
app.use(express.static(path.join(__dirname, '/')));

app.get('/api/account/profile', (req, res) => {
	res.contentType('application/json');
	res.send({name: 'Austin', userId: '155'});
});

app.listen(app.get('port'), () => console.info('Server listening on port 8081...'));
