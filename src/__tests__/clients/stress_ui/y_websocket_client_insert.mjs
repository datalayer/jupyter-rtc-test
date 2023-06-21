import WebSocket from "ws";
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Doc();

const id = process.argv[2]

let wsProvider = new WebsocketProvider(
  'ws://127.0.01:8888/jupyter_rtc_test/room',
  'room_stress',
  doc,
  { WebSocketPolyfill: WebSocket }
);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

wsProvider.on('status', event => {
  console.log('Status', event);
  if (event.status === 'connected') {
    t.insert(0, 'C');
    sleep(5000).then(() => {
      const o = t.toJSON();
      console.log('---', o);
      const numberOfClient = o.split("C").length - 1;
      wsProvider.disconnect();
      wsProvider.awareness.destroy();
      wsProvider.destroy();
      const ws = new WebSocket('ws://127.0.0.1:8888/jupyter_rtc_test/stresser', {
        perMessageDeflate: false
      });
      ws.on('open', function open() {
        ws.send('info:' + id + ':' + o);
        ws.close();
        const expected = 10;
        if (numberOfClient !== expected) {
          throw new Error(`Found ${numberOfClient}, should be ${expected}.`);
        }
      });
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
