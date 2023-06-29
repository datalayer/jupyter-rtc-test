import { Doc, Map, Text } from 'yjs';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const doc = new Doc();
const clocker = doc.getMap('clocker');
const cells = doc.getArray("cells");
const state = doc.getMap("state");

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room-1',
  doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Event status', event.status);
});

var clock = -1

clocker.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clk = clocker.get('clock')
      if (clk > clock) {
        const c = [new Map([['source', new Text('1 + 2')], ['metadata', {'foo': 'bar'}]])];
        cells.push(c);
        state.set('state', {'dirty': false});
        clock = clk + 1;
        clocker.set('clock', clock);
      }
    }
  })
});
