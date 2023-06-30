import WebSocket from "ws";
import { chromium } from "playwright";
import { WebsocketProvider } from 'y-websocket';
import { YNotebook } from '@jupyter/ydoc';

const clientId = Number(process.argv[2])
const documentLength = Number(process.argv[3])
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
        document: JSON.stringify(notebook.toJSON()),
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
      notebook.changed.connect((_, notebookChange) => {
        const cell = notebookChange.cellsChange[0].insert[0];
        cell.changed.connect((_, __) => {
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
      });
      setInterval(() => {
        if (MUTATE_DOC) {
          if (notebook.cells.length === 1) {
            notebook.getCell(0).setSource("x=1")
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
