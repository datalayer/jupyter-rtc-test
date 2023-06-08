import ws from "ws";
import { WebsocketProvider } from 'y-websocket';
import { Doc, Map, Text } from 'yjs';

const _doc = new Doc();
const _test = _doc.getMap('_test');
const _cells = _doc.getArray("cells");
const _state = _doc.getMap("state");

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room-1',
  _doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log(event.status)
});

var clock = -1

_test.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clk = _test.get('clock')
      if (clk > clock) {
        const cells = [new Map([['source', new Text('1 + 2')], ['metadata', {'foo': 'bar'}]])];
        _cells.push(cells);
        _state.set('state', {'dirty': false});
        clock = clk + 1;
        _test.set('clock', clock);
      }
    }
  })
});
