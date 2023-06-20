import ws from "ws";
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Doc();

let wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room_stress',
  doc,
  { WebSocketPolyfill: ws }
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

wsProvider.on('status', event => {
  console.log('Status', event);
  if (event.status === 'connected') {
    t.insert(0, 'C');
    sleep(5000).then(() => {
      const numberOfClient = t.toJSON().split("C").length - 1;
      wsProvider.disconnect();
      wsProvider.awareness.destroy();
      wsProvider.destroy();
      const expected = 10;
      if (numberOfClient !== expected) {
        throw new Error(`Found ${numberOfClient}, should be ${expected}.`);
      }
    });
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
