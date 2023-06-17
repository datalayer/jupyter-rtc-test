import { Doc } from 'yjs';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const _doc = new Doc();
const _clocker = _doc.getMap('clocker');
const _map = _doc.getMap('map');

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room_0',
  _doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Event status', event.status);
});

var clock = -1;

_clocker.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clk = _clocker.get('clock');
      if (clk > clock) {
        _map.set('out', _map.get('in') + 1);
        clock = clk + 1;
        _clocker.set('clock', clock);
      }
    }
  })
});