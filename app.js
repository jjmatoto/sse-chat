var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var EventedArray = require('array-events');

var PORT = 3000;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use('/', express.static('public')); //config staticos

//TODO: middleware log

var chat = new EventedArray(
	[{	'autor': 'chat',
		'text': 'hola, bienvenido al chat guachii pirulii! :)',
		'date': new Date()}]);

app.get('/api/chat/stream', function (req, res) {
	req.socket.setTimeout(Number.MAX_VALUE);
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });
    req.on("close", function(){console.log('close!')});
	chat.on('change', function(e){
		console.log('ha cambiado el array, lo envio al frontal...');
		console.log('va salir esto : ' + JSON.stringify(chat));
		res.write('data: '+JSON.stringify(chat)+'\n\n');
	});	
});



app.get('/api/chat/', function(req, res){
	res.send(JSON.stringify(chat));
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