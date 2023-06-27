import WebSocket from "ws";
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const id = Number(process.argv[2])
const textLength = Number(process.argv[3])
const warmupPeriodSeconds = Number(process.argv[4])

const doc = new Doc();
const t = doc.getText('t');


let MUTATE_DOC = true;


let wsProvider = new WebsocketProvider(
  'ws://127.0.01:8888/jupyter_rtc_test/room',
  'jupyter_rtc_test',
  doc,
  { WebSocketPolyfill: WebSocket }
);

function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const infoWebSocket = new WebSocket('ws://127.0.0.1:8888/jupyter_rtc_test/stresser');
infoWebSocket.onopen = () => {
  const info = { id, action: 'info', text: t.toString() }
  infoWebSocket.send(JSON.stringify(info));
};
infoWebSocket.onmessage = (message) => {
  const data = JSON.parse(message.data);
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
        if (t.length < textLength) {
          t.insert(0, randomString(4));
        } else {  
          t.delete(0, t.length / 2);
        }
        console.log('Nodejs client', id, t.toString());
      }
    }, 1000);
  }
});

wsProvider.on('sync', isSynced => {
  console.log('Nodejs client isSynced', id, t.toString());
});
/*
t.observe(event => {
  console.log('event', t.toString());
});
*/
