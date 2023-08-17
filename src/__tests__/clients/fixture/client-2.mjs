import ws from "ws";
import { YNotebook } from '@jupyter/ydoc';
import { WebsocketProvider } from 'y-websocket';

const ynotebook = new YNotebook();
const test = ynotebook.ydoc.getMap('_test');

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room_2',
  ynotebook.ydoc,
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
        for (let cell of ynotebook.cells) {
          cells.push(cell.toJSON());
        }
        const metadata = ynotebook.getMetadata();
        const nbformat = ynotebook.nbformat;
        const nbformat_minor = ynotebook.nbformat_minor;
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
