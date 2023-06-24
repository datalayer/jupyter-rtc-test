import { useState, useEffect, useCallback } from 'react';
import { Button, Box, Heading, ActionMenu, ActionList } from '@primer/react';
import { Grid } from '@primer/react-brand';
import { Slider } from "@datalayer/primer-addons";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chart from './charts/Chart';

import scenarii from './scenarii/scenarii.json';

type Scenario = {
  name: string,
  description: string;
  defaulNumberOfClients: number;
  maxNumberOfClients: number;
  nodeJsScript: string;
  pythonScript: string;
  shouldConverge: boolean;
}

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
      <Grid enableOverlay style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
        <Grid.Column span={12}>
          <ActionMenu>
            <ActionMenu.Button>Test scenario</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item onSelect={event => console.log('New file')}>New file</ActionList.Item>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Edit file</ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item variant="danger">Reset colllected data</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          <Box mt={3}/>
          <Heading sx={{fontSize: 2}}>Parameters</Heading>
          <Box mt={3}/>
          <Slider label="Number of node.js clients" min={1} max={100} value={10} onChange={() => {}} />
          <Box mt={3}/>
          <Slider label="Number of python clients" min={1} max={100} value={10} onChange={() => {}} />
          <Box mt={3}/>
          <Slider label="Start period (seconds)" min={1} max={10} value={2} onChange={() => {}} />
          <Box mt={3}/>
          <Slider label="Maximum text length (characters)" min={1} max={500} value={100} onChange={() => {}} />
          <Box mt={3}/>
          {
            running ?
              <Button variant="danger" onClick={stopTest} disabled={readyState !== ReadyState.OPEN}>Stop test</Button>
            :
              <Button variant="primary" onClick={startTest} disabled={readyState !== ReadyState.OPEN}>Start test</Button>
          }
        </Grid.Column>
        <Grid.Column span={6}>
          <Box>
            <Heading sx={{fontSize: 2, mb: 2}}>Clients</Heading>
            {
              Array.from(clients.values()).sort((a, b) => (a.id < b.id ? -1 : (a.id == b.id ? 0 : 1))).map(client => {
                return <Box key={client.id}>Client {client.id}: {client.text}</Box>
              })
            }
          </Box>
          <Box>
            <Heading sx={{fontSize: 2, mb: 2}}>Messages History</Heading>
            {
              messageHistory.reverse().map((value, index) => {
                return <Box key={index}>{value.data}</Box>
              })
            }
          </Box>
        </Grid.Column>
        <Grid.Column span={6}>
          <Box>
            <Chart/>
          </Box>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default TesterTab;
