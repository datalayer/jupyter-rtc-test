import WebSocket from "ws";
import { chromium } from "playwright";
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const clientId = Number(process.argv[2])
const textLength = Number(process.argv[3])
// const warmupPeriodSeconds = Number(process.argv[4])
const roomName = process.argv[5]

const run = () => {

  const doc = new Doc();
  const t = doc.getText('t');
  
  const WAIT_MS = 5000;

  let MUTATE_DOC = true;

  let wsProvider = new WebsocketProvider(
    'ws://127.0.01:8888/jupyter_rtc_test/room',
    roomName,
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
    /*
    setInterval(() => {
      const info = {
        clientId,
        clientType: 'browser',
        mutating: MUTATE_DOC,
        action: 'info',
        timestamp: Date.now(),
        document: t.toString(),
      }
      infoWebSocket.send(JSON.stringify(info));
    }, WAIT_MS);
    */
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
    if (event.status === 'connected') {
      setInterval(() => {
        if (MUTATE_DOC) {
          if (t.length < textLength) {
            t.insert(0, randomString(4));
          } else {
            t.delete(0, t.length / 2);
          }
        }
      }, WAIT_MS);
    }
  });

  t.observe(event => {
    const info = {
      clientId,
      clientType: 'browser',
      mutating: MUTATE_DOC,
      action: 'info',
      timestamp: Date.now(),
      document: t.toString(),
    }
    infoWebSocket.send(JSON.stringify(info));
  });
  
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.evaluate(run());
await page.close();
await browser.close();
