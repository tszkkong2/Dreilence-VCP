// var connect = require('connect');
// var serveStatic = require('serve-static');

// connect().use(serveStatic(__dirname)).listen(8080);

var express = require('express');
var app = express();
app.use(express.static(__dirname));

var http = require('http').Server(app);
var io = require('socket.io')(http);
var assert = require('assert');
var vcChecker = require('vectorclock');
var clients = [];
var clocks = [];
//var clocks = [{clock:{}},{clock:{}}];

//console.log(assert.equal(vcChecker.compare(clocks[0],clocks[1]),vcChecker.CONCURRENT));

app.get('/', function(req, res){


});

io.on('connection', function(socket){
  clients[socket.id] = require('./js/client.js');

  console.log(clients);
  console.log('a user connected');

  socket.emit("setId",socket.id);

  socket.on('drawmsg', function(msg){
  	socket.broadcast.emit('drawmsg',msg);
    clients[socket.id].curseq++;
    var cseq = clients[socket.id].curseq;
    
    clients[socket.id].sequences.push("Seq " + cseq + ". " + msg);

    //console.log(clients[socket.id]);
  });

  socket.on('disconnect', function(){
    delete clients[socket.id];
    //console.log(clients);
    console.log('user disconnected');
  });
});


http.listen(8080, function(){
  console.log('listening on *:8080');
  console.log(__dirname);
});