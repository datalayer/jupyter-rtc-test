import WebSocket from "ws";
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const id = process.argv[2]
const doc = new Doc();

let wsProvider = new WebsocketProvider(
  'ws://127.0.01:8888/jupyter_rtc_test/room',
  'jupyter_rtc_test',
  doc,
  { WebSocketPolyfill: WebSocket }
);

wsProvider.on('status', event => {
  console.log('Status', event);
  if (event.status === 'connected') {
    t.insert(0, 'C');
    setInterval(function() {
      const text = t.toJSON();
      console.log('text', id, text);
      const infoWebSocket = new WebSocket('ws://127.0.0.1:8888/jupyter_rtc_test/stresser');
      infoWebSocket.on('open', function open() {
        const info = { id, action: 'info', text }
        infoWebSocket.send(JSON.stringify(info));
        infoWebSocket.close();
      });
    }, 5000);
  }
});

wsProvider.on('sync', isSynced => {
  console.log('isSynced', isSynced, t.toString());
});

const t = doc.getText('t');
t.observe(event => {
  console.log('t event', t.toString());
});
