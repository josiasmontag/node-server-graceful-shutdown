module.exports = enableGracefulShutdown;

function enableGracefulShutdown(server, socketIdleTimeout) {
  server.socketIdleTimeout = socketIdleTimeout || 10000;
  server.activeConnections = {};

  server.on('connection', function(conn) {
    var key = conn.remoteAddress + ':' + conn.remotePort;
    server.activeConnections[key] = conn;
    conn.on('close', function() {
      delete server.activeConnections[key];
    });
  });

  server.shutdown = function(cb) {
    server.close(cb);
    for (var key in server.activeConnections) {
      server.activeConnections[key].setTimeout(server.socketIdleTimeout, function() {
        if(server.activeConnections[key]) {
          server.activeConnections[key].destroy();  
        }
      });
    }
  };
}