import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import styled from 'styled-components';
import { Button, Box, Heading, ActionMenu, ActionList, Text, Spinner, Label } from '@primer/react';
import { Slider, CloseableFlash } from "@datalayer/primer-addons";
import { AlertIcon, BookIcon, CheckIcon } from '@primer/octicons-react';
import { PauseIcon, RestartIcon } from "@datalayer/icons-react";
import { Grid } from '@primer/react-brand';
import useColors from './../../../hooks/ColorsHook';
import Blankslate from '../blankslate/Blankslate';
import UsersGauge from './charts/UsersGauge';

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
  nodejsScript: string;
  numberPythonClients: number;
  maxNumberPythonClients: number;
  pythonScript: string;
  warmupPeriodSeconds: number;
  maxWarmupPeriodSeconds: number;
  textLength: number;
  maxTextLength: number;
  isConverging: boolean;
}

type Message = {
  clientId: number;
  clientType: 'browser' | 'nodejs' | 'python';
  mutating: boolean;
  action: string;
  scenario?: Scenario;
  text: string;
  timestamp: number;
}

type Client = Message;

type Clients = Map<number, Client>;

const createMessage = (clientId: number, action: string, scenario?: Scenario): string => {
  const m: Message = {
    clientId,
    clientType: 'browser',
    mutating: false,
    action,
    scenario,
    text: '',
    timestamp: Date.now(),
  }
  return JSON.stringify(m);
}

const TesterTab = (): JSX.Element => {
  const { okColor, nokColor } = useColors();
  const [ scenarii, _ ] = useState<Scenario[]>(scenariiJson as Scenario[]);
  const [ scenario, setScenario ] = useState<Scenario | undefined>(scenarii[0]);
  const [ nodejsUsers, setNodejsUsers ] = useState<Clients>(new Map<number, Client>());
  const [ pythonUsers, setPythonUsers ] = useState<Clients>(new Map<number, Client>());
  const [ running, setRunning ] = useState(false);
  const [ paused, setPaused ] = useState(false);
  const [ doc, setDoc ] = useState(new Doc());
  const [ socketUrl, __ ] = useState('ws://localhost:8888/jupyter_rtc_test/stresser');
  const [ messageHistory, setMessageHistory ] = useState<MessageEvent[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const sendStart = useCallback(() => sendMessage(createMessage(-1, 'start', scenario)), [scenario]);
  const sendStop = useCallback(() => sendMessage(createMessage(-1, 'stop', scenario)), [scenario]);
  const sendPause = useCallback(() => sendMessage(createMessage(-1, 'pause', scenario)), [scenario]);
  const sendRestart = useCallback(() => sendMessage(createMessage(-1, 'restart', scenario)), [scenario]);
  const getColor = (a: string, b: string) => {
    return a === b ? okColor : nokColor;
  }
  useEffect(() => {
    const wsProvider = new WebsocketProvider(
      'ws://127.0.01:8888/jupyter_rtc_test/room',
      'jupyter_rtc_test',
      doc,
    );
    wsProvider.on('status', event => {
      if (event.status === 'connected') {
        setDoc(doc);
      }
    });
    return () => {
      wsProvider.destroy();
    }
  }, [doc]);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse((lastMessage as any).data);
      if (message.action === 'info' && message.clientType === 'nodejs') {
        nodejsUsers.set(Number(message.clientId), message);
        setNodejsUsers(nodejsUsers);
      }
      else if (message.action === 'info' && message.clientType === 'python') {
        pythonUsers.set(Number(message.clientId), message);
        setPythonUsers(pythonUsers);
      }
    }
  }, [lastMessage, setMessageHistory]);
  const resetScenarioData = () => {
    setNodejsUsers(new Map<number, Client>());
    setPythonUsers(new Map<number, Client>());
    setDoc(new Doc());
    setMessageHistory([]);
  }
  const startTest = () => {
    sendStart();
    setRunning(true);
  }
  const stopTest = () => {
    sendStop();
    setRunning(false);
    setPaused(false);
  }
  const pauseTest = () => {
    sendPause();
    setPaused(true);
  }
  const restartTest = () => {
    sendRestart();
    setPaused(false);
  }
  const browserText = doc.getText('t').toString();
  let okNodejsUsers = 0;
  let nokNodejsUsers = 0;
  Array.from(nodejsUsers.values()).map(user => {
    if (user.text === browserText) {
      okNodejsUsers++;
    } else {
      nokNodejsUsers++;
    }
  });
  let okPythonUsers = 0;
  let nokPythonUsers = 0;
  Array.from(pythonUsers.values()).map(user => {
    if (user.text === browserText) {
      okPythonUsers++;
    } else {
      nokPythonUsers++;
    }
  });
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
                  <Text><Label variant="primary">Node.js</Label> <code>{scenario.nodejsScript}</code></Text>
                </Box>
                <Box mt={3}>
                  <Slider label="Number of remote Node.js users" min={1} max={scenario.maxNumberNodejsClients} value={scenario.numberNodejsClients} disabled={running} onChange={(numberNodejsClients) => setScenario({...scenario, numberNodejsClients})} />
                </Box>
                <Box mt={3}>
                  <Text><Label variant="accent">Python</Label> <code>{scenario.pythonScript}</code></Text>
                </Box>
                <Box mt={3}>
                  <Slider label="Number of remote Python users" min={1} max={scenario.maxNumberPythonClients} value={scenario.numberPythonClients} disabled={running} onChange={(numberPythonClients) => setScenario({...scenario, numberPythonClients})} />
                </Box>
                <Box mt={3}>
                  <Slider label="Warmup period (seconds)" min={1} max={scenario.maxWarmupPeriodSeconds} value={scenario.warmupPeriodSeconds} disabled={running} onChange={(warmupPeriodSeconds) => setScenario({...scenario, warmupPeriodSeconds})} />
                </Box>
                <Box mt={3}>
                  <Slider label="Maximum text length (characters)" min={1} max={scenario.maxTextLength} disabled={running} value={scenario.textLength} onChange={(textLength) => setScenario({...scenario, textLength})} />
                </Box>
              </>
          }
          {
            scenario && (
              <Box sx={{display: 'flex'}} mt={3}>
                { running ?
                  <>
                    <Button leadingVisual={() => <Spinner sx={{paddingTop: 1, paddingBottom: 1}}/>} variant="danger" onClick={stopTest} disabled={readyState !== ReadyState.OPEN}>
                      Terminate users
                    </Button>
                    <Box ml={3}/>
                    { paused ?
                      <Button leadingVisual={RestartIcon} variant="primary" onClick={restartTest}>
                        Restart users
                      </Button>
                    :
                      <Button leadingVisual={PauseIcon} variant="danger" onClick={pauseTest}>
                        Pause users
                      </Button>
                    }
                  </>
                :
                  <Button variant="primary" onClick={startTest} disabled={readyState !== ReadyState.OPEN}>
                    Launch users
                  </Button>
                }
              </Box>
            )
          }
        </Grid.Column>
        { scenario ?
          <>
            <Grid.Column span={3}> 
              <UsersGauge title="Node.js Users" ok={okNodejsUsers} nok={nokNodejsUsers} />
            </Grid.Column>
            <Grid.Column span={3}>
              <UsersGauge title="Python Users" ok={okPythonUsers} nok={nokPythonUsers} />
            </Grid.Column>
          </>
        :
          <Grid.Column span={6}>
          </Grid.Column>
        }
        { scenario ?
          <>
            <Grid.Column span={12}>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Browser Document</Heading>
                <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                  <Grid.Column span={12}>
                    <OverflowText>{ browserText }</OverflowText>
                  </Grid.Column>
                </Grid>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Node.js Remote Documents</Heading>
                <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                {
                  running && Array.from(nodejsUsers.entries()).length === 0 ?
                    <Spinner/>
                  :
                    Array.from(nodejsUsers.values()).sort((a, b) => (a.clientId < b.clientId ? -1 : (a.clientId == b.clientId ? 0 : 1))).map(user => {
                      return <Grid.Column span={3} key={user.clientId}>
                        <Box key={user.clientId} style={{backgroundColor: getColor(browserText, user.text)}}><OverflowText>Node.js {user.clientId}: {user.text}</OverflowText></Box>
                      </Grid.Column>
                  })
                }
                </Grid>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Python Remote Documents</Heading>
                <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                {
                  running && Array.from(pythonUsers.entries()).length === 0 ?
                  <Spinner/>
                :
                  Array.from(pythonUsers.values()).sort((a, b) => (a.clientId < b.clientId ? -1 : (a.clientId == b.clientId ? 0 : 1))).map(user => {
                    return <Grid.Column span={3} key={user.clientId}>
                      <Box key={user.clientId} style={{backgroundColor: getColor(browserText, user.text)}}><OverflowText>Python {user.clientId}: {user.text}</OverflowText></Box>
                    </Grid.Column>
                })
              }
                </Grid>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Server Document</Heading>
                <CloseableFlash variant="warning">The display of the Server Document still needs to be implemented.</CloseableFlash>
                <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                </Grid>
              </Box>
              <Box>
                <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Infos History (latest 100)</Heading>
                {
                  running && messageHistory.length === 0 ?
                    <Spinner/>
                  :                
                    messageHistory.reverse().slice(0, 100).map((value, index) => {
                      const data = (value as any).data;
                      return <Box key={index}>
                        <code>{data}</code>
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
