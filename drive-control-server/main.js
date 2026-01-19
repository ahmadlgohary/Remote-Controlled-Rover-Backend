const WebSocket = require('ws');
const { handleConnection } = require('./handlers/connection');

const PORT = 8443;

// Start the WebSocket server listening on the specified port
const webSocketServer = new WebSocket.Server({ port: PORT });

// use the handleConnection() for new connections
webSocketServer.on('connection', handleConnection);

console.log(`WebSocket server listening on port ${PORT}`);
