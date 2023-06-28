import WebSocket from "ws";
import { YNotebook } from '@jupyter/ydoc';
import { WebsocketProvider } from 'y-websocket';

const clientId = Number(process.argv[2])
// const textLength = Number(process.argv[3])
// const warmupPeriodSeconds = Number(process.argv[4])
const roomName = process.argv[5]

const notebook = new YNotebook();

const WAIT_MS = 5000;

let MUTATE_DOC = true;

let wsProvider = new WebsocketProvider(
  'ws://127.0.01:8888/jupyter_rtc_test/room',
  roomName,
  notebook.ydoc,
  { WebSocketPolyfill: WebSocket }
);

const infoWebSocket = new WebSocket('ws://127.0.0.1:8888/jupyter_rtc_test/stresser');
infoWebSocket.onopen = () => {
  setInterval(() => {
    const info = { 
      clientId,
      clientType: 'nodejs',
      mutating: MUTATE_DOC,
      action: 'info',
      timestamp: Date.now(),
      document: JSON.stringify(notebook.toJSON()),
    }
    infoWebSocket.send(JSON.stringify(info));
  }, WAIT_MS);
};
infoWebSocket.onmessage = (message) => {
  const data = JSON.parse(message.data.toString());
  if (data.action === 'pause') {
    MUTATE_DOC = false;
  }
  if (data.action === 'restart') {
    MUTATE_DOC = true;
  }
};

wsProvider.on('status', event => {
//  console.log('Status', event);
  if (event.status === 'connected') {
    setInterval(() => {
      if (MUTATE_DOC) {
        if (notebook.cells.length === 1) {
          notebook.getCell(0).setSource("x=1")
        }
//        console.log('Nodejs client', clientId, t.toString());
      }
    }, WAIT_MS);
  }
});

wsProvider.on('sync', isSynced => {
//  console.log('Nodejs client is synced', isSynced, clientId, t.toString());
});
/*
t.observe(event => {
  console.log('event', t.toString());
});
*/
