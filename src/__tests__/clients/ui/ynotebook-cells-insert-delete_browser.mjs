import WebSocket from "ws";
import { chromium } from "playwright";
import { WebsocketProvider } from 'y-websocket';
import { YNotebook } from '@jupyter/ydoc';

const clientId = Number(process.argv[2])
const cellsLength = Number(process.argv[3])
// const warmupPeriodSeconds = Number(process.argv[4])
const roomName = process.argv[5]

const run = () => {

  const notebook = new YNotebook();

  const WAIT_MS = 5000;

  let MUTATE_DOC = true;

  let wsProvider = new WebsocketProvider(
    'ws://127.0.01:8888/jupyter_rtc_test/room',
    roomName,
    notebook.ydoc,
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
      notebook.changed.connect((_, notebookChange) => {
        const info = {
          clientId,
          clientType: 'browser',
          mutating: MUTATE_DOC,
          action: 'info',
          timestamp: Date.now(),
          document: JSON.stringify(notebook.toJSON()),
          room: roomName,
        }
        infoWebSocket.send(JSON.stringify(info));    
      });
      setInterval(() => {
        if (MUTATE_DOC) {
          if (notebook.cellsLength > cellsLength) {
            notebook.deleteCell(0);
          }
          else {
            const cell = {
              id: '',
              cell_type: 'code',
              metadata: {
                nbformat: 4,
                nbformat_minor: 4,
                jupyter: {
                  rtc_test: true,
                }
              },
              source: randomString(5),
              outputs: [],
              execution_count: 0,
            };
            notebook.insertCell(0, cell);
          }
        }
      }, WAIT_MS);
    }
  });

}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.evaluate(run());
await page.close();
await browser.close();
