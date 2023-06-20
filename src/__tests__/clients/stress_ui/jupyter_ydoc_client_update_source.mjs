import ws from "ws";
import { YNotebook } from '@jupyter/ydoc';
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
  'ws://127.0.01:8888/jupyter_rtc_test/tester',
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
      notebook.getCell(0).updateSource(0, 0, 'C');
      wsProvider.disconnect();
      wsProvider.awareness.destroy();
      wsProvider.destroy();
      notebook.dispose();  
    });
  }
});
