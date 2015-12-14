http = require('http');
fs = require('fs');
 
port = 3000;
host = '127.0.0.1';

users = {}
BOMB_SECS = 40

server = http.createServer( function(req, res) {
 
    if (req.method == 'POST') {
        res.writeHead(200, {'Content-Type': 'text/html'});
 
        var body = '';
        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
            obj = JSON.parse(body)
            var username = obj.player.name;
            var ts = obj.provider.timestamp;

            if(!users.hasOwnProperty(username)){
                users[username] = {'planted': false, 'explodes': null};
            }

            player = users[username];

            if(obj.hasOwnProperty('round')){

                // bomb WAS NOT planted and now IS
                if(obj.round.bomb == "planted"){
                    if(!player.planted){
                        player = {
                            "planted": true,
                            "explodes": ts + BOMB_SECS * 1000
                        }
                    }
                }

                // round over - reset bomb status
                if(obj.round.phase == "over"){
                    player = {'planted': false, 'explodes': null};
                }
            }

        	res.end( '' );
        });
    }
    else
    {
        console.log("Not expecting other request types...");
        res.writeHead(200, {'Content-Type': 'text/html'});
		var html = '<html><body>HTTP Server at http://' + host + ':' + port + '</body></html>';
        res.end(html);
    }
 
});
 
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);