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
});

const a = doc.getArray('a');
a.observe(event => {
  console.log("Event", event);
});

a.push([1]);

// console.log('Doc', doc);
// console.log('Doc Array', doc.getArray("a"));
