var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
//var EventedArray = require('array-events');

// var chat = new EventedArray(
// 	[{	'autor': 'chat',
// 		'text': 'hola, bienvenido al chat guachii pirulii! :)',
// 		'date': '00/00/0000'}]);
var chat = 	[{	'autor': 'chat',
		'text': 'hola, bienvenido al chat guachii pirulii! :)',
		'date': new Date()}];

var DIR_NAME = 'C:/_workspace/sse-chat'
var PORT = 3000;

app.get('/', function (req, res) {
	res.sendFile(path.join(DIR_NAME+'/index.html'));
  });

app.get('/api/chat/', function(req, res){
	// chat.on('change', function(e){
	// 	console.log('ha cambiado el array, lo envio al frontal...');
	// 	res.send(JSON.stringify(chat)+'\n\n');
	// });
	//console.log('va salir esto : ' + JSON.stringify(chat));
	req.socket.setTimeout(Number.MAX_VALUE);
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });
    req.on("close", function(){console.log('close!')});
	setInterval(function(){
		console.log('writing: ' + ( JSON.stringify(chat)) + '\n\n');
		res.write('data: ' + (  JSON.stringify(chat)) + '\n\n');
	}, 1000);
});


app.post('/api/chat', function(req, res){
	console.log('entra POST...');
	var aut = req.body.aut,
	txt = req.body.txt,
	date = req.body.date | new Date(),
	input = {'autor': aut,'text': txt,'date': date};

	console.log('guardamos : ' + JSON.stringify());
	chat.push(input);

	res.send('');
	console.log('... sale POST');
});


app.listen(PORT | 3000);