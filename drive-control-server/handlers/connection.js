const { connectedClients } = require('../clients/clients');
const { handleMessage } = require('./message');

/**
 * Function to handle a new websocket connection
 * Sets up message and close event listeners for the clients
 * 
 * @param {WebSocket} webSocket - The WebSocket connection object for the new client
 */

function handleConnection(webSocket) {
    console.log('New client connected!');

    // Maintain a state for this specific client
    const clientState = {
        id: null
    };

    // Handle incoming messages
    webSocket.on('message', (message) => {
        handleMessage(webSocket, message, clientState);
    });


    // Handle client disconnection
    webSocket.on('close', () => {
        if (clientState.id) {
            // remove client from the connectedClients object
            delete connectedClients[clientState.id];
            console.log(`Client ${clientState.id} disconnected`);
        } else {
            console.log('Client disconnected ---');
        }
    });
}

module.exports = {
    handleConnection
};
