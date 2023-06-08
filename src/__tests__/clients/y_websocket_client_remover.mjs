import { Doc } from 'yjs';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const doc = new Doc();

let wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room_stress',
  doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Status', event);
  if (event.status === 'connected') {
    t.delete(0, 1);
  }
});

wsProvider.on('sync', isSynced => {
  console.log('isSynced', isSynced);
  console.log('t', t.toString());
});

const t = doc.getText('t');
t.observe(event => {
  console.log('t', t.toString());
});
/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
await sleep(3000);

wsProvider.disconnect();
wsProvider.awareness.destroy();
wsProvider.destroy();
*/