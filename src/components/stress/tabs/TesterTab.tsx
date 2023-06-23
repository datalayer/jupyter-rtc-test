import { useState, useEffect, useCallback } from 'react';
import { Button, Box, Heading } from '@primer/react';
import { Slider } from "@datalayer/primer-addons";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chart from './charts/Chart';

// import scenarii from './scenarii/scenarii.json';

type Message = {
  id: string;
  action: string;
  text: string;
}

type Client = Message;

type Clients = Map<number, Client>;

const createMessage = (id: number, action: string, text: string): string => {
  const m: Message = {
    id: id.toString(),
    action,
    text,
  }
  return JSON.stringify(m);
}

const TesterTab = (): JSX.Element => {
  const [ clients, setClients ] = useState<Clients>(new Map<number, Client>());
  const [ running, setRunning ] = useState(false);
  const [ socketUrl, _ ] = useState('ws://localhost:8888/jupyter_rtc_test/stresser');
  const [ messageHistory, setMessageHistory ] = useState<MessageEvent[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const sendStart = useCallback(() => sendMessage(createMessage(-1, 'start', '')), []);
  const sendStop = useCallback(() => sendMessage(createMessage(-1, 'stop', '')), []);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);
      if (message.action === 'info') {
        clients.set(Number(message.id), message);
        setClients(clients);
      }
    }
  }, [lastMessage, setMessageHistory]);
  const startTest = () => {
    sendStart();
    setRunning(true);
  }
  const stopTest = () => {
    sendStop();
    setRunning(false);
  }
  return (
    <>
      <Box sx={{display: 'flex'}}>
        <Box>
          <Slider name="slider" min={1} max={10} onChange={() => {}} />
          {
            running ?
              <Button variant="danger" onClick={stopTest} disabled={readyState !== ReadyState.OPEN}>Stop test</Button>
            :
              <Button variant="primary" onClick={startTest} disabled={readyState !== ReadyState.OPEN}>Start test</Button>
          }
        </Box>
        <Box ml={3}>
          <Box>
            <Heading sx={{fontSize: 1, mb: 2}}>Clients</Heading>
            {
              Array.from(clients.values()).sort((a, b) => (a.id < b.id ? -1 : (a.id == b.id ? 0 : 1))).map(client => {
                return <Box key={client.id}>Client {client.id}: {client.text}</Box>
              })
            }
          </Box>
          <Box>
            <Heading sx={{fontSize: 1, mb: 2}}>Messages History</Heading>
            {
              messageHistory.reverse().map((value, index) => {
                return <Box key={index}>{value.data}</Box>
              })
            }
          </Box>
          <Box>
            <Chart/>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default TesterTab;
