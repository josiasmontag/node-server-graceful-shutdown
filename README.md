# node http(s) server graceful shutdown

Adds a ``shutdown(callback)`` to nodes http(s) servers. ``shutdown()`` will stop accepting new connections and waits until all requests are finished.
This is very similar to the node builtin [close()](https://nodejs.org/api/net.html#net_server_close_callback) function with the only difference that ``shutdown()`` destroys idle connections (e.g. keep alive connections) using a timeout (10 seconds as default) without data transfer.

## Usage

```javascript
var enableGracefulShutdown = require('server-graceful-shutdown');

var server = http.createServer(function(req, res) {
  // do stuff
});

server.listen(80);

// enhance server with a 'shutdown' function
enableGracefulShutdown(server);
// you can set the socket idle timeout using the second parameter 
// e.g. enableGracefulShutdown(server, 5000);

// some time later...
server.shutdown(function() {
	// all requests are finished 
	// we can 
	// process.exit() 
	// now
});
```