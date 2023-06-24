import { useState, useEffect, useCallback } from 'react';
import { Button, Box, Heading, ActionMenu, ActionList, Text, Spinner, Label } from '@primer/react';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Grid } from '@primer/react-brand';
import { Slider } from "@datalayer/primer-addons";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chart from './charts/Chart';

import scenariiJson from './scenarii/scenarii.json';

type Scenario = {
  name: string;
  description: string;
  defaulNumberOfClients: number;
  maxNumberOfClients: number;
  nodeJsScript: string;
  pythonScript: string;
  shouldConverge: boolean;
}

type Message = {
  id: number;
  action: string;
  text: string;
}

type Client = Message;

type Clients = Map<number, Client>;

const createMessage = (id: number, action: string, text: string): string => {
  const m: Message = {
    id,
    action,
    text,
  }
  return JSON.stringify(m);
}

const TesterTab = (): JSX.Element => {
  const [ scenarii, _ ] = useState<Scenario[]>(scenariiJson as Scenario[]);
  const [ scenario, setScenario ] = useState<Scenario>();
  const [ clients, setClients ] = useState<Clients>(new Map<number, Client>());
  const [ running, setRunning ] = useState(false);
  const [ doc, setDoc ] = useState(new Doc());
  const [ socketUrl, __ ] = useState('ws://localhost:8888/jupyter_rtc_test/stresser');
  const [ messageHistory, setMessageHistory ] = useState<MessageEvent[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const sendStart = useCallback(() => sendMessage(createMessage(-1, 'start', '')), []);
  const sendStop = useCallback(() => sendMessage(createMessage(-1, 'stop', '')), []);
  useEffect(() => {
    const wsProvider = new WebsocketProvider(
      'ws://127.0.01:8888/jupyter_rtc_test/room',
      'jupyter_rtc_test',
      doc,
    );
    const t = doc.getText('t');
    wsProvider.on('status', event => {
      console.log('Status', event);
      if (event.status === 'connected') {
        t.insert(0, 'C');
        setDoc(doc);
      }
    });
  }, []);
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
  const resetCollectedData = () => {
    setClients(new Map<number, Client>());
    setMessageHistory([]);
  }
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
      <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
        <Grid.Column span={12}>
         <Heading sx={{fontSize: 3, paddingBottom: 3}}>Scenario</Heading>
          <ActionMenu>
            <ActionMenu.Button>Test scenarii</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                { scenarii.map(scenario => <ActionList.Item key={scenario.name} onSelect={() => setScenario(scenario)}>{scenario.name}</ActionList.Item>) }
                <ActionList.Divider />
                <ActionList.Item variant="danger" onClick={resetCollectedData}>Reset colllected data</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          {
            scenario &&
              <>
                <Box mt={3}/>
                <Box><Text><b>{scenario.name}</b>: {scenario.description}</Text></Box>
                <Box><Text><b>Should converge:</b> {scenario.shouldConverge.toString()}</Text></Box>
                <Box mt={3}/>
                <Slider label="Number of node.js clients" min={1} max={100} value={10} disabled={running} onChange={() => {}} />
                <Box><Text><Label variant="accent">Node.js</Label> <code>{scenario.nodeJsScript}</code></Text></Box>
                <Box mt={3}/>
                <Slider label="Number of python clients" min={1} max={100} value={10} disabled={running} onChange={() => {}} />
                <Box><Text><Label variant="accent">Python</Label> <code>{scenario.pythonScript}</code></Text></Box>
                <Box mt={3}/>
                <Slider label="Warmup period (seconds)" min={1} max={10} value={2} disabled={running} onChange={() => {}} />
                <Box mt={3}/>
                <Slider label="Maximum text length (characters)" min={1} max={500} disabled={running} value={100} onChange={() => {}} />
                <Box mt={3}/>
              </>
          }
          {
            scenario && (
              running ?
                <Box sx={{display: 'flex'}}>
                  <Box mr={1}><Spinner /></Box>
                  <Button variant="danger" onClick={stopTest} disabled={readyState !== ReadyState.OPEN}>Stop test</Button>
                </Box>
              :
                <Button variant="primary" onClick={startTest} disabled={readyState !== ReadyState.OPEN}>Start test</Button>
            )
          }
        </Grid.Column>
        <Grid.Column span={6}>
        <Box>
            { scenario && <Heading sx={{fontSize: 3, mb: 2}}>Browser Client</Heading> }
            { scenario &&
              doc.getText('t').toString()
            }
          </Box>
          <Box>
            { scenario && <Heading sx={{fontSize: 3, mb: 2}}>Remote Clients</Heading> }
            { scenario &&
              Array.from(clients.values()).sort((a, b) => (a.id < b.id ? -1 : (a.id == b.id ? 0 : 1))).map(client => {
                return <Box key={client.id}>Client {client.id}: {client.text}</Box>
              })
            }
          </Box>
          <Box>
            { scenario && <Heading sx={{fontSize: 3, mb: 2}}>Infos History</Heading> }
            { scenario &&
              messageHistory.reverse().map((value, index) => {
                return <Box key={index}>{value.data}</Box>
              })
            }
          </Box>
        </Grid.Column>
        <Grid.Column span={6}>
          <Box>
            {  scenario && <Chart/> }
          </Box>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default TesterTab;
