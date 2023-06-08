// import { Doc } from 'yjs';
import { YNotebook } from '@jupyter/ydoc';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const notebook = new YNotebook()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/*
await sleep(3000);

wsProvider.disconnect();
wsProvider.awareness.destroy();
wsProvider.destroy();
*/

let wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room_notebook_stress',
  notebook.ydoc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Status', event);
  if (event.status === 'connected') {
    sleep(1000).then(() => {
      console.log('Notebook', notebook);
      const metadata = {
        orig_nbformat: 1,
        kernelspec: {
          display_name: 'python',
          name: 'python'
        }
      };
      notebook.setMetadata(metadata);
      notebook.getCell(0).setSource("x=1")
      wsProvider.disconnect();
      wsProvider.awareness.destroy();
      wsProvider.destroy();
      notebook.dispose();  
    });
  }
});
