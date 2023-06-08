import ws from "ws";
import { WebsocketProvider } from 'y-websocket';
import { Doc, Map, Text } from 'yjs';

const ydoc = new Doc();
const ytest = ydoc.getMap('_test');
const ycells = ydoc.getArray("cells");
const ystate = ydoc.getMap("state");

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234', 'my-roomname',
  ydoc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log(event.status)
});

var clock = -1

ytest.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clk = ytest.get('clock')
      if (clk > clock) {
        const cells = [new Map([['source', new Text('1 + 2')], ['metadata', {'foo': 'bar'}]])];
        ycells.push(cells);
        ystate.set('state', {'dirty': false});
        clock = clk + 1;
        ytest.set('clock', clock);
      }
    }
  })
});
