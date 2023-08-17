import ws from "ws";
import { YNotebook } from '@jupyter/ydoc';
import { WebsocketProvider } from 'y-websocket';

const notebook = new YNotebook()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'update_source',
  notebook.ydoc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Status', event);
  if (event.status === 'connected') {
    sleep(1000).then(() => {
      console.log('Notebook Cells count', notebook.cells.length);
      const metadata = {
        orig_nbformat: 1,
        kernelspec: {
          display_name: 'python',
          name: 'python'
        }
      };
      notebook.setMetadata(metadata);
      notebook.getCell(0).updateSource(0, 0, 'C');
      sleep(3000).then( () => {
        wsProvider.disconnect();
        wsProvider.awareness.destroy();
        wsProvider.destroy();
        notebook.dispose();    
      });
    });
  }
});
