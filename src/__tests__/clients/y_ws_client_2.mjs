import ws from "ws";
import { WebsocketProvider } from 'y-websocket';
import { YNotebook } from '@jupyter/ydoc';

const _notebook = new YNotebook();
const _map = _notebook.ydoc.getMap('_test');

const wsProvider = new WebsocketProvider(
  'ws://127.0.0.1:1234',
  'room-1',
  _notebook.ydoc,
  { WebSocketPolyfill: ws }
);

wsProvider.on('status', event => {
  console.log(event.status)
})

_map.observe(event => {
  event.changes.keys.forEach((change, key) => {
    if (key === 'clock') {
      const clock = _map.get('clock');
      if (clock === 0) {
        const cells = []
        for (let cell of _notebook.cells) {
          cells.push(cell.toJSON());
        }
        const metadata = _notebook.getMetadata();
        const nbformat = _notebook.nbformat;
        const nbformat_minor = _notebook.nbformat_minor;
        const source = {
          cells,
          metadata,
          nbformat,
          nbformat_minor
        };
        _map.set('source', source);
        _map.set('clock', 1);
      }
    }
  })
});
