var http = require('http');
var static = require('node-static');

var path = new static.Server(`${__dirname}/`)

http.createServer(function (req, res) {

}).listen