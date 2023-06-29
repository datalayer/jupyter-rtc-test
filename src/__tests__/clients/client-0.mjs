import { Doc } from 'yjs';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const doc = new Doc();
const clocker = doc.getMap('clocker');
const map = doc.getMap('map');

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room-0',
  doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Event status', event.status);
});

var clock = -1;

clocker.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clk = clocker.get('clock');
      if (clk > clock) {
        map.set('out', map.get('in') + 1);
        clock = clk + 1;
        clocker.set('clock', clock);
      }
    }
  })
});
