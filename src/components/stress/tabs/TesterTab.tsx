import { useState, useEffect, useCallback } from 'react';
import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { YNotebook } from '@jupyter/ydoc';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import styled from 'styled-components';
import { Button, Box, Heading, ActionMenu, ActionList, Text, Spinner, Label, Pagehead, Timeline, Octicon } from '@primer/react';
import { Slider, CloseableFlash } from "@datalayer/primer-addons";
import { AlertIcon, BookIcon, GitCommitIcon } from '@primer/octicons-react';
import { PauseIcon, RestartIcon, PythonIcon, NodeJsIcon, JupyterServerIcon, BrowserIcon, JupyterIcon } from "@datalayer/icons-react";
import { Grid } from '@primer/react-brand';
import useColors from './../../../hooks/ColorsHook';
import Blankslate from '../blankslate/Blankslate';
import UsersGauge from './charts/UsersGauge';
import { strip } from './../../../utils/utils';

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
  numberBrowserClients: number;
  maxNumberBrowserClients: number;
  browserScript: string;
  numberPythonClients: number;
  maxNumberPythonClients: number;
  pythonScript: string;
  warmupPeriodSeconds: number;
  maxWarmupPeriodSeconds: number;
  textLength: number;
  maxTextLength: number;
  shouldConverge: boolean;
  documentType: 'text' | 'notebook';
  room: string;
}

type Message = {
  clientId: number;
  clientType: 'browser' | 'nodejs' | 'python';
  mutating: boolean;
  action: string;
  scenario?: Scenario;
  document: string;
  timestamp: number;
}

type User = Message;

type Users = Map<number, User>;

const createMessage = (clientId: number, action: string, scenario?: Scenario): string => {
  const m: Message = {
    clientId,
    clientType: 'browser',
    mutating: false,
    action,
    scenario,
    document: '',
    timestamp: Date.now(),
  }
  return JSON.stringify(m);
}

const TesterTab = (): JSX.Element => {
  const { okColor, nokColor } = useColors();
  const [ scenarii, _ ] = useState<Scenario[]>(scenariiJson as Scenario[]);
  const [ scenario, setScenario ] = useState<Scenario | undefined>(scenarii[0]);
  const [ pythonUsers, setPythonUsers ] = useState<Users>(new Map<number, User>());
  const [ browserUsers, setBrowserUsers ] = useState<Users>(new Map<number, User>());
  const [ nodejsUsers, setNodejsUsers ] = useState<Users>(new Map<number, User>());
  const [ running, setRunning ] = useState(false);
  const [ paused, setPaused ] = useState(false);
  const [ doc, setDoc ] = useState(new Doc());
  const [ notebook, setNotebook ] = useState(new YNotebook());
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
    const providedDoc = scenario?.documentType === 'text' ? doc : notebook.ydoc;
    if (scenario) {
      const wsProvider = new WebsocketProvider(
        'ws://127.0.01:8888/jupyter_rtc_test/room',
        scenario.room,
        providedDoc,
      );
      wsProvider.on('status', event => {
        if (event.status === 'connected') {
          console.debug('WS Provider is connected.');
          if (scenario?.documentType === 'notebook') {
            if (notebook.cells.length === 0) {
              const cell = {
                id: '',
                cell_type: 'code',
                meta: {
                  nbformat: 4,
                  nbformat_minor: 4,
                  jupyter: {
                    rtc_test: true,
                  }
                },
                metadata: {
                  nbformat: 4,
                  nbformat_minor: 4,
                  jupyter: {
                    rtc_test: true,
                  }
                },
                source: 'x=1',
                outputs: [],
                execution_count: 0,
              };
              notebook.insertCells(0, [cell]);
            }
            else {
              const text = doc.getText('t');
              if (text.length === 0) {
                text.insert(0, 'Initial Content.');
              }
            }
          }
        }
      });
      return () => {
        wsProvider.destroy();
      }
    }
  }, [doc, notebook, scenario]);
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
      else if (message.action === 'info' && message.clientType === 'browser') {
        browserUsers.set(Number(message.clientId), message);
        setBrowserUsers(browserUsers);
      }
    }
  }, [lastMessage, setMessageHistory]);
  const resetScenarioData = () => {
    setNodejsUsers(new Map<number, User>());
    setBrowserUsers(new Map<number, User>());
    setPythonUsers(new Map<number, User>());
    setMessageHistory([]);
    setDoc(new Doc());
    setNotebook(new YNotebook());
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
  const browserDocument = scenario?.documentType === 'text' ?
      doc.getText('t').toString()
    : 
      JSON.stringify(notebook.toJSON());
  let okPythonUsers = 0;
  let nokPythonUsers = 0;
  Array.from(pythonUsers.values()).map(user => {
    if (user.document === browserDocument) {
      okPythonUsers++;
    } else {
      nokPythonUsers++;
    }
  });
  let okNodejsUsers = 0;
  let nokNodejsUsers = 0;
  Array.from(nodejsUsers.values()).map(user => {
    if (user.document === browserDocument) {
      okNodejsUsers++;
    } else {
      nokNodejsUsers++;
    }
  });
  let okBrowserUsers = 0;
  let nokBrowserUsers = 0;
  Array.from(browserUsers.values()).map(user => {
    if (user.document === browserDocument) {
      okBrowserUsers++;
    } else {
      nokBrowserUsers++;
    }
  });
  return (
    <>
      <ActionMenu>
        <ActionMenu.Button>Test scenarii</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList sx={{width: 300}}>
            { scenarii.map(s => (
              <ActionList.Item key={s.id} disabled={s.id === scenario?.id} onSelect={() => setScenario(s)}>
                <ActionList.LeadingVisual>
                  { s.documentType === 'notebook' && <JupyterIcon/> }
                </ActionList.LeadingVisual>
                {s.name}
                <ActionList.Description variant="block">
                  {s.description}
                </ActionList.Description>
              </ActionList.Item>)
            )}
            { scenario && <>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={resetScenarioData}>Reset scenario data</ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => setScenario(undefined)}>Unload scenario</ActionList.Item>
            </>
            }
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
      { scenario &&
        <Pagehead><b>{scenario.name}</b></Pagehead>
      }
      <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
        <Grid.Column span={3}>
        { scenario &&
          <>
            <Box mt={3}>
              <Text>{scenario.description}</Text>
            </Box>
            <Box mt={3}>
              <Text><b>Should converge:</b> {scenario.shouldConverge.toString()}</Text>{!scenario.shouldConverge && <span style={{paddingLeft: 3}}><AlertIcon/></span>}
            </Box>
            <Box mt={3}>
              <Text><b>Document type:</b> {scenario.documentType}</Text>
            </Box>
            <Box mt={3}>
              <Text><Label variant="accent">Python</Label> <code>{scenario.pythonScript}</code></Text>
            </Box>
            <Box mt={3}>
              <Slider label="Python users" min={0} max={scenario.maxNumberPythonClients} value={scenario.numberPythonClients} disabled={running} onChange={(numberPythonClients) => setScenario({...scenario, numberPythonClients})} />
            </Box>
            <Box mt={3}>
              <Text><Label variant="accent">Node.js</Label> <code>{scenario.nodejsScript}</code></Text>
            </Box>
            <Box mt={3}>
              <Slider label="Node.js users" min={0} max={scenario.maxNumberNodejsClients} value={scenario.numberNodejsClients} disabled={running} onChange={(numberNodejsClients) => setScenario({...scenario, numberNodejsClients})} />
            </Box>
            <Box mt={3}>
              <Text><Label variant="accent">Browser</Label> <code>{scenario.browserScript}</code></Text>
            </Box>
            <Box mt={3}>
              <Slider label="Browser users" min={0} max={scenario.maxNumberBrowserClients} value={scenario.numberBrowserClients} disabled={running} onChange={(numberBrowserClients) => setScenario({...scenario, numberBrowserClients})} />
            </Box>
            <Box mt={3}>
              <Slider label="Text length" min={1} max={scenario.maxTextLength} disabled={running} value={scenario.textLength} onChange={(textLength) => setScenario({...scenario, textLength})} />
            </Box>
            <Box mt={3}>
              <Slider label="Warmup (seconds)" min={1} max={scenario.maxWarmupPeriodSeconds} value={scenario.warmupPeriodSeconds} disabled={running} onChange={(warmupPeriodSeconds) => setScenario({...scenario, warmupPeriodSeconds})} />
            </Box>
          </>
        }
        { scenario && (
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
            <UsersGauge title="Python" ok={okPythonUsers} nok={nokPythonUsers} />
          </Grid.Column>
          <Grid.Column span={3}>
            <UsersGauge title="Node.js" ok={okNodejsUsers} nok={nokNodejsUsers} />
          </Grid.Column>
          <Grid.Column span={3}>
            <UsersGauge title="Browser" ok={okBrowserUsers} nok={nokBrowserUsers} />
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
              <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Local Browser Document <Label>{scenario.documentType}</Label></Heading>
              <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
                <Grid.Column span={12}>
                  <OverflowText>{browserDocument}</OverflowText>
                </Grid.Column>
              </Grid>
            </Box>
            <Box>
              <Heading sx={{fontSize: 2, mb: 2, mt:2}}><PythonIcon colored style={{paddingRight: 3}}/>Remote Python Documents</Heading>
              <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
              { running && Array.from(pythonUsers.entries()).length === 0 ?
                <Spinner/>
              :
                Array.from(pythonUsers.values()).sort((a, b) => (a.clientId < b.clientId ? -1 : (a.clientId == b.clientId ? 0 : 1))).map(user => {
                  return <Grid.Column span={3} key={user.clientId}>
                    <Box key={user.clientId} style={{backgroundColor: getColor(browserDocument, user.document)}}><OverflowText>Python {user.clientId}: {strip(user.document)}</OverflowText></Box>
                  </Grid.Column>
              })
            }
              </Grid>
            </Box>
            <Box>
              <Heading sx={{fontSize: 2, mb: 2, mt:2}}><NodeJsIcon colored style={{paddingRight: 3}}/>Remote Node.js Documents</Heading>
              <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
              { running && Array.from(nodejsUsers.entries()).length === 0 ?
                  <Spinner/>
                :
                  Array.from(nodejsUsers.values()).sort((a, b) => (a.clientId < b.clientId ? -1 : (a.clientId == b.clientId ? 0 : 1))).map(user => {
                    return <Grid.Column span={3} key={user.clientId}>
                      <Box key={user.clientId} style={{backgroundColor: getColor(browserDocument, user.document)}}><OverflowText>Node.js {user.clientId}: {strip(user.document)}</OverflowText></Box>
                    </Grid.Column>
                })
              }
              </Grid>
            </Box>
            <Box>
              <Heading sx={{fontSize: 2, mb: 2, mt:2}}><BrowserIcon colored style={{paddingRight: 3}}/>Remote Browser Documents</Heading>
              <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
              { running && Array.from(browserUsers.entries()).length === 0 ?
                  <Spinner/>
                :
                  Array.from(browserUsers.values()).sort((a, b) => (a.clientId < b.clientId ? -1 : (a.clientId == b.clientId ? 0 : 1))).map(user => {
                    return <Grid.Column span={3} key={user.clientId}>
                      <Box key={user.clientId} style={{backgroundColor: getColor(browserDocument, user.document)}}><OverflowText>Browser {user.clientId}: {strip(user.document)}</OverflowText></Box>
                    </Grid.Column>
                })
              }
              </Grid>
            </Box>
            <Box>
              <Heading sx={{fontSize: 2, mb: 2, mt:2}}><JupyterServerIcon colored style={{paddingRight: 3}}/>Jupyter Server Document</Heading>
              <CloseableFlash variant="warning" leadingIcon={AlertIcon}>The display of the Jupyter Server Document still needs to be implemented.</CloseableFlash>
              <Grid style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}>
              </Grid>
            </Box>
            <Box>
              <Heading sx={{fontSize: 2, mb: 2, mt:2}}>Infos History (latest 5)</Heading>
              { running && messageHistory.length === 0 ?
                  <Spinner/>
                :
                  <Timeline>
                    { messageHistory.reverse().slice(0, 5).map((value, index) => {
                      const data = (value as any).data;
                      return (
                        <Timeline.Item key={index}>
                          <Timeline.Badge>
                            <Octicon icon={GitCommitIcon} />
                          </Timeline.Badge>
                          <Timeline.Body><code>{data}</code></Timeline.Body>
                        </Timeline.Item>
                        )
                      })
                    }
                  </Timeline>
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
