import ws from "ws";
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Doc();

let wsProvider = new WebsocketProvider(
  'ws://127.0.01:8888/jupyter_rtc_test/tester',
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
//    t.applyDelta([{ delete: 1 }])
    t.applyDelta([{ insert: 'C' }])
    sleep(5000).then(() => {
      wsProvider.disconnect();
      wsProvider.awareness.destroy();
      wsProvider.destroy();
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
