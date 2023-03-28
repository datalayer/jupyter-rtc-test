import Websocket, { WebSocketServer } from 'ws';

const PORT = 8899;

const wsSocket = new WebSocketServer({ port: PORT });

wsSocket.on('connection', (ws) => {
  console.log('New client connected!');
  ws.on('close', () => console.log('Client has disconnected!'));
  ws.on('error', console.error);
  /*
  // A client WebSocket broadcasting to all connected WebSocket clients, including itself.
  ws.on('message', function message(data, isBinary) {
    wsSocket.clients.forEach(function each(client) {
      if (client.readyState === Websocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  */
  // A client WebSocket broadcasting to every other connected WebSocket clients, excluding itself.
  ws.on('message', function message(data, isBinary) {
    wsSocket.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === Websocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

setInterval(() => {
  wsSocket.clients.forEach((client) => {
    const data = JSON.stringify({ 'type': 'time', 'time': new Date().toTimeString() });
    client.send(data);
  });
}, 1000);

setInterval(() => {
  wsSocket.clients.forEach((client) => {
    const messages = ['Hello', 'What do you ponder?', 'Thank you for your time', 'Be Mindful', 'Thank You'];
    const random = Math.floor(Math.random() * messages.length);
    let position = { x: Math.floor(Math.random() * 200), y: Math.floor(Math.random() * 150) }
    const data = JSON.stringify({ 'type': 'message', 'message': messages[random], 'position': position });
    client.send(data);
  });
}, 8000);

console.log('Websocket server running on port', PORT)
