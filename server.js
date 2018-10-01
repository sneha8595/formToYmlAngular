// example using express.js:
var express = require('express')
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var yaml = require('write-yaml');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const userName = 'user';
const password = 'password123';

app.use(express.static(__dirname + '/public'));


// route for Home-Page
app.post('/generateYamlFile', function (req, res) {
  var data = { users: [{ user: req.body }] };
  yaml('data/' + req.body['User Name'] + '.yml', data, function (err) {
    res.redirect('/');
  });
});
app.listen(8080);