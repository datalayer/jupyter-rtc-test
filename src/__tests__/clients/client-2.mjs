import { YNotebook } from '@jupyter/ydoc';
import ws from "ws";
import { WebsocketProvider } from 'y-websocket';

const notebook = new YNotebook();
const test = notebook.ydoc.getMap('_test');

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room-2',
  notebook.ydoc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log('Event status', event.status);
})

test.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clock = test.get('clock');
      if (clock === 0) {
        const cells = []
        for (let cell of notebook.cells) {
          cells.push(cell.toJSON());
        }
        const metadata = notebook.getMetadata();
        const nbformat = notebook.nbformat;
        const nbformat_minor = notebook.nbformat_minor;
        const source = {
          cells,
          metadata,
          nbformat,
          nbformat_minor
        };
        test.set('source', source);
        test.set('clock', 1);
      }
    }
  })
});
