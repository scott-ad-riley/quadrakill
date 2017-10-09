var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public/build'));
app.use(express.static(__dirname + '/public/assets'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/assets/index.html'));
});

var server = app.listen(3000, function () {
  var port = server.address().port;

  console.log('Client Server started at http://localhost:%s', port);
});
