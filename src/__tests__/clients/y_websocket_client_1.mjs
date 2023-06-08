import { Doc, Map, Text } from 'yjs';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const _doc = new Doc();
const _clocker = _doc.getMap('clocker');
const _cells = _doc.getArray("cells");
const _state = _doc.getMap("state");

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room_1',
  _doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Event status', event.status);
});

var clock = -1

_clocker.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clk = _clocker.get('clock')
      if (clk > clock) {
        const cells = [new Map([['source', new Text('1 + 2')], ['metadata', {'foo': 'bar'}]])];
        _cells.push(cells);
        _state.set('state', {'dirty': false});
        clock = clk + 1;
        _clocker.set('clock', clock);
      }
    }
  })
});
