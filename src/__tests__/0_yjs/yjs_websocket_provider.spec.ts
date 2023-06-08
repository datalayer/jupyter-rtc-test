import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket'; // import WebsocketProvider from '../yjs/ws/tmp/server-1';
// import { WebrtcProvider } from 'y-webrtc'; // import { WebrtcProvider } from '../yjs/webrtc/client/y-webrtc';
// import { IndexeddbPersistence } from 'y-indexeddb';

describe('Y.js Providers', () => {

  it('y.js providers', async () => {

    const ydoc = new Doc();

    // Sync clients with the y-websocket provider.
    const websocketProvider = new WebsocketProvider(
      'ws://127.0.0.1:1234',
      'ws-test-room',
      ydoc,
      { WebSocketPolyfill: require('ws') }
    );
    websocketProvider.on('status', event => {
      console.log('websocketProvider status', event.status); // logs "connected" or "disconnected"
    });

    /*
    // Sync clients with the y-webrtc provider.
    // Failing with ReferenceError: WebSocket is not defined - Needs { WebSocketPolyfill: require('ws') }
    const webrtcProvider = new WebrtcProvider(
      'webrtc-test-room',
      ydoc,
      {
        signaling: ['ws://127.0.0.1:4444'],
        password: undefined,
        awareness: undefined,
        maxConns: 20,
        filterBcConns: true,
        peerOpts: {},
//        WebSocketPolyfill: require("ws")
      }
    );
    webrtcProvider.on('status', event => {
      console.log('websocketProvider', event.status) // logs "connected" or "disconnected"
    });

    // This allows you to instantly get the (cached) documents data.
    const indexeddbProvider = new IndexeddbPersistence(
      'my-roomname', 
      ydoc
    );
    indexeddbProvider.whenSynced.then(() => {
      console.log('loaded data from indexed db')
    });
    */

    // Array of numbers which produce a sum.
    const yarray = ydoc.getArray('count');

    // Observe changes of the sum.
    yarray.observe(event => {
      // Print updates when the data changes.
      console.log(
        'new sum ' + yarray.toArray().reduce((a: any, b: any) => a + b)
      );
    });
    // add 1 to the sum
    yarray.push([1]); // => "new sum: 1"
    await new Promise(r => setTimeout(r, 5000));

  });

});
