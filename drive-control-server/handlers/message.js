const WebSocket = require('ws');
const { connectedClients } = require('../clients/clients');
const { updateAndPrintErrors } = require('../utils/error_tracker');

/**
 * This function handles incoming Websocket messages from a client
 * @param {WebSocket} webSocket 
 * @param {string} message 
 * @param {Object} clientState 
 * @returns 
 */
function handleMessage(webSocket, message, clientState) {
  let jsonMessage;

  try {
    // Parse the incoming json message
    jsonMessage = JSON.parse(message.toString());

    // json message is successfully received 
    // so we update the message counter
    updateAndPrintErrors(true);

    // upon connection a client sends a register message
    if (jsonMessage.type === 'register') {

      // save the client ID in its state
      clientState.id = jsonMessage.id;

      // Add the client to the connectedClients object
      connectedClients[clientState.id] = webSocket;
      console.log(`Client registered: ${clientState.id}`);
      return;
    }

    // this message is sent from the front-end with a rover target  
    if (jsonMessage.type === 'driving_commands') {

      // get the target rover websocket connection
      const targetClient = connectedClients[jsonMessage.to];

      // Forward the driving commands to the target client if it exists and is connected
      if (targetClient && targetClient.readyState === WebSocket.OPEN) {
        targetClient.send(JSON.stringify(jsonMessage));
        console.log(
          `Message sent from ${clientState.id} to ${jsonMessage.to}`
        );
      } else {
        console.log(`Client ${jsonMessage.to} not found or not open`);
      }
    }
  } catch (err) {
    console.error('WebSocket error:', err);
    // update the error counter
    updateAndPrintErrors(false);
  }
}

module.exports = {
  handleMessage
};
