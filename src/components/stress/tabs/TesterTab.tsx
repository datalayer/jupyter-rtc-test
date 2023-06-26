import { useState, useEffect, useCallback, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import styled from 'styled-components';
import { useTheme, Button, Box, Heading, ActionMenu, ActionList, Text, Spinner, Label } from '@primer/react';
import { AlertIcon, BookIcon, CheckIcon } from '@primer/octicons-react';
import { Grid } from '@primer/react-brand';
import { Slider, CloseableFlash } from "@datalayer/primer-addons";
import Blankslate from '../blankslate/Blankslate';
import Chart from './charts/Chart';

import scenariiJson from './scenarii/scenarii.json';

const OverflowText = styled(Text)`
  overflow-wrap: break-word;
`;

type Scenario = {
  id: number;
  name: string;
  description: string;
  numberNodejsClients: number;
  maxNumberNodejsClients: number;
  nodeJsScript: string;
  numberPythonClients: number;
  maxNumberPythonClients: number;
  pythonScript: string;
  warmupPeriodSeconds: number;
  maxWarmupPeriodSeconds: number;
  textLenght: number;
  maxTextLenght: number;
  isConverging: boolean;
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
  const { theme } = useTheme();
  const okColor = useMemo(() => theme?.colorSchemes.light.colors.success.muted, []);
  const nokColor = useMemo(() => theme?.colorSchemes.light.colors.severe.muted, []);
  const [ scenarii, _ ] = useState<Scenario[]>(scenariiJson as Scenario[]);
  const [ scenario, setScenario ] = useState<Scenario | undefined>(scenarii[0]);
  const [ users, setUsers ] = useState<Clients>(new Map<number, Client>());
  const [ running, setRunning ] = useState(false);
  const [ doc, setDoc ] = useState(new Doc());
  const [ socketUrl, __ ] = useState('ws://localhost:8888/jupyter_rtc_test/stresser');
  const [ messageHistory, setMessageHistory ] = useState<MessageEvent[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const sendStart = useCallback(() => sendMessage(createMessage(-1, 'start', '')), []);
  const sendStop = useCallback(() => sendMessage(createMessage(-1, 'stop', '')), []);
  const getColor = (a: string, b: string) => {
    return a === b ? okColor : nokColor;
  }
  useEffect(() => {
    const wsProvider = new WebsocketProvider(
      'ws://127.0.01:8888/jupyter_rtc_test/room',
      'jupyter_rtc_test',
      doc,
    );
    const t = doc.getText('t');
    wsProvider.on('status', event => {
      if (event.status === 'connected') {
        t.insert(0, 'C');
        setDoc(doc);
      }
    });
  }, []);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse((lastMessage as any).data);
      if (message.action === 'info') {
        users.set(Number(message.id), message);
        setUsers(users);
      }
    }
  }, [lastMessage, setMessageHistory]);
  const resetScenarioData = () => {
    setUsers(new Map<number, Client>());
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
  const browserText = doc.getText('t').toString();
  return (
    <>
      <Heading sx={{fontSize: 3, paddingBottom: 3}}>Scenario</Heading>
      <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
        <Grid.Column span={6}>
          <ActionMenu>
            <ActionMenu.Button>Test scenarii</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList sx={{width: 300}}>
                { scenarii.map(s => (
                  <ActionList.Item key={s.id} disabled={s.id === scenario?.id} onSelect={() => setScenario(s)}>
                    <ActionList.LeadingVisual>
                      { s.isConverging ? <CheckIcon /> : <AlertIcon/> }
                    </ActionList.LeadingVisual>
                    {s.name}
                    <ActionList.Description variant="block">
                      {s.description}
                    </ActionList.Description>
                  </ActionList.Item>)
                )}
                {scenario && <>
                  <ActionList.Divider />
                  <ActionList.Item variant="danger" onSelect={resetScenarioData}>Reset scenario data</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item variant="danger" onSelect={() => setScenario(undefined)}>Unload scenario</ActionList.Item>
                </>
                }
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          {
            scenario &&
              <>
                <Box mt={3}>
                  <Text><b>{scenario.name}</b>: {scenario.description}</Text>
                </Box>
                <Box mt={3}>
                  <Text><b>Is typically converging:</b> {scenario.isConverging.toString()}</Text>
                </Box>
                <Box mt={3}>
                  <Slider label="Number of remote Node.js users" min={1} max={scenario.maxNumberNodejsClients} value={scenario.numberNodejsClients} disabled={running} onChange={(numberNodejsClients) => setScenario({...scenario, numberNodejsClients})} />
                </Box>
                <Box mt={3}>
                  <Text><Label variant="primary">Node.js</Label> <code>{scenario.nodeJsScript}</code></Text>
                </Box>
                <Box mt={3}>
                  <Slider label="Number of remote Python users" min={1} max={scenario.maxNumberPythonClients} value={scenario.numberPythonClients} disabled={running} onChange={() => {}} />
                </Box>
                <Box mt={3}>
                  <Text><Label variant="accent">Python</Label> <code>{scenario.pythonScript}</code></Text>
                </Box>
                <Box mt={3}>
                  <Slider label="Warmup period (seconds)" min={1} max={scenario.maxWarmupPeriodSeconds} value={scenario.warmupPeriodSeconds} disabled={running} onChange={() => {}} />
                </Box>
                <Box mt={3}>
                  <Slider label="Maximum text length (characters)" min={1} max={scenario.maxTextLenght} disabled={running} value={scenario.textLenght} onChange={() => {}} />
                </Box>
              </>
          }
          {
            scenario && (
              <Box sx={{display: 'flex'}} mt={3}>
                { running ?
                  <>
                    <Button leadingVisual={() => <Spinner sx={{paddingTop: 1, paddingBottom: 1}}/>} variant="danger" onClick={stopTest} disabled={readyState !== ReadyState.OPEN}>
                      Stop users
                    </Button>
                    <Box ml={3}/>
                    <Button leadingVisual={() => <Spinner sx={{paddingTop: 1, paddingBottom: 1}}/>} variant="danger" onClick={stopTest} disabled={true}>
                      Pause users
                    </Button>
                  </>
                :
                  <Button variant="primary" onClick={startTest} disabled={readyState !== ReadyState.OPEN}>
                    Start users
                  </Button>
                }
              </Box>
            )
          }
        </Grid.Column>
        <Grid.Column span={6}>
          { scenario &&
            <Box>
              <Chart/>
            </Box>
          }
        </Grid.Column>
        { scenario ?
          <>
            <Grid.Column span={12}>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Browser Document</Heading>
                <OverflowText>{ browserText }</OverflowText>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Node.js Remote Documents</Heading>
                <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                {
                  Array.from(users.values()).sort((a, b) => (a.id < b.id ? -1 : (a.id == b.id ? 0 : 1))).map(user => {
                    return <Grid.Column span={6}>
                      <Box key={user.id} style={{backgroundColor: getColor(browserText, user.text)}}><OverflowText>Client {user.id}: {user.text}</OverflowText></Box>
                    </Grid.Column>
                  })
                }
                </Grid>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Python Remote Documents</Heading>
                <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                {
                }
                </Grid>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Server Document</Heading>
                <CloseableFlash variant="warning">The display of the Server Document still needs to be implemented.</CloseableFlash>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Infos History (latest 100)</Heading>
                {
                  messageHistory.reverse().slice(0, 100).map((value, index) => {
                    return <Box key={index}>
                      {(value as any).data}
                    </Box>
                  })
                }
              </Box>
            </Grid.Column>
          </>
        :
          <>
            <Grid.Column span={6}>
              <Blankslate border>
                <Blankslate.Visual>
                  <BookIcon size="medium" />
                </Blankslate.Visual>
                <Blankslate.Heading>Choose a scenario</Blankslate.Heading>
                <Blankslate.Description>A scenario allows you to configure and run stress tests.</Blankslate.Description>
              </Blankslate>
            </Grid.Column>
          </>
        }
      </Grid>
    </>
  );
}

export default TesterTab;
