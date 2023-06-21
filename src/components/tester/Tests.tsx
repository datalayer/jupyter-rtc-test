import { useState, useEffect } from 'react';
import { Button } from '@primer/react';
import WsClient from '../../handler/WsClient';

const Tests = (): JSX.Element => {
  const [ running, setRunning ] = useState(false)
  const [ ws, setWs ] = useState<WsClient>();
  useEffect(() => {
    const wsClient = new WsClient('ws://localhost:8888/jupyter_rtc_test/stresser');
    const ws = wsClient.ws;
    ws.onopen = (event: Event) => {
      console.log('WsClient open', event);
      ws.send('ping');
    }
  setWs(wsClient);
  }, []);
  const startTest = () => {
    ws?.startTest();
    setRunning(true);
  }
  const stopTest = () => {
    ws?.stopTest();
    setRunning(false);
  }
  return (
    <>
    { running ?
        <Button variant="danger" onClick={stopTest}>Stop test</Button>
      :
        <Button variant="primary" onClick={startTest}>Start test</Button>
    }
    </>
  );
};

export default Tests;
