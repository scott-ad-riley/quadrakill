var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public/build'));
app.use(express.static('public/assets'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/assets/index.html'));
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Static Asset Server Started at http://%s:%s', host, port);
});
