module.exports = enableGracefulShutdown;

function enableGracefulShutdown(server, socketIdleTimeout) {
  server.socketIdleTimeout = socketIdleTimeout || 10000;
  var connections = {};

  server.on('connection', function(conn) {
    var key = conn.remoteAddress + ':' + conn.remotePort;
    connections[key] = conn;
    conn.on('close', function() {
      delete connections[key];
    });
  });

  server.shutdown = function(cb) {
    server.close(cb);
    for (var key in connections) {
      connections[key].setTimeout(server.socketIdleTimeout, function() {
        connections[key].destroy();  
      });
    }
  };
}