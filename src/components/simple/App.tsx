import { useEffect, useState, useRef } from 'react';
// import { io } from "socket.io-client";

const ENDPOINT = 'ws://127.0.0.1:8899';
// const ENDPOINT = "ws://127.0.0.1:3001";
// const ENDPOINT = "ws://127.0.0.1:8888/api/jupyter/api/yjs/notebook:tmp.ipynb";

function App() {
  const ws = useRef<WebSocket>();
  const [isPaused, setPause] = useState(false);
  const [response, setResponse] = useState('');
  useEffect(() => {
    /*
    const socket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: false,
      extraHeaders: {
        "My-Custom-Header": "abcd"
      }
    });
    socket.on('connect', () => {
      console.log('🚀 Websocket connected');
      socket.send("Hello from client!");
      socket.emit('test', {map: 4, coords: '0.0'});
    });
    socket.on('message', (message) => {
      console.log('Received websocket message: ', message);
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on("time", data => {
      setResponse(data);
    });
*/
    ws.current = new WebSocket(ENDPOINT);
    const wsCurrent = ws.current;
    wsCurrent.onerror = e => {
      alert(e);
    };
    wsCurrent.onopen = e => {
      const array = new Float32Array(5);
      console.log('🚀 Websocket connected');
      for (let i = 0; i < array.length; ++i) {
        array[i] = i / 2;
      }
      wsCurrent.send(array);
    };
    return () => {
      wsCurrent.close();
    };
  }, []);
  useEffect(() => {
    ws.current!.onmessage = e => {
      console.log('Received websocket message', e);
      if (!isPaused) {
        setResponse(JSON.parse(e.data));
      }
    };
  }, [isPaused]);
  return (
    <>
      <button onClick={() => setPause(!isPaused)}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      {JSON.stringify(response)}
    </>
  );
}

export default App;
