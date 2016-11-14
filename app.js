var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var EventedArray = require('array-events');

var PORT = 3000;

// to support JSON-encoded bodies
app.use( bodyParser.json() );
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
}));

//config staticos
app.use('/', express.static('public'));

//TODO:
//	middleware log
//	middleware SSE


var clientId = 0;
var clients = {};
var chat = [
	{'autor': 'chat',
	'text': 'hola, bienvenido al chat undefined',
	'date': new Date()}
];

function emit(msg){

	console.log("Clients: " + Object.keys(clients) + " <- " + msg);
	for (clientId in clients) {
		clients[clientId].write("data: "+ JSON.stringify(msg) + "\n\n"); 
	};

}

app.get('/api/chat/stream', function (req, res) {
	console.log('open connection!');
	req.socket.setTimeout(Number.MAX_VALUE);
	
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache'
	});
	res.write('\n');

    (function(clientId) {
        clients[clientId] = res;
        req.on("close", function(){delete clients[clientId]});
    })(++clientId)

	req.on('close', function(){
		console.log('connection close!')
	});
});


app.get('/api/chat/', function(req, res){
	res.send(JSON.stringify(chat));
});

app.post('/api/chat', function(req, res){
	console.log('entra POST...');
	var msg = {'autor': req.body.aut,'text': req.body.txt,'date': req.body.date | new Date()};
	chat.push(msg);
	emit(msg);
	res.send('200');
	console.log('... sale POST');
});


app.listen(PORT | 3000);