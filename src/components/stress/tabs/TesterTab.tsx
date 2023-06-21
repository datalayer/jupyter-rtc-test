import { useState, useEffect, useCallback } from 'react';
import { Button, Box } from '@primer/react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chart from './charts/Chart';

type Message = {
  id: number;
  text: string;
}

type Messages = Map<number, Message>;

const TesterTab = (): JSX.Element => {
  const [ messages, setMessages ] = useState<Messages>(new Map<number, Message>());
  const [ running, setRunning ] = useState(false);
  const [ socketUrl, _ ] = useState('ws://localhost:8888/jupyter_rtc_test/stresser');
  const [ messageHistory, setMessageHistory ] = useState<MessageEvent[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const sendStart = useCallback(() => sendMessage('start'), []);
  const sendStop = useCallback(() => sendMessage('stop'), []);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const data = lastMessage.data;
      if (data.startsWith('info:')) {
        const parts = data.split(':');
        const id = Number(parts[1]);
        const text = parts[2];
        messages.set(id, { id, text });
        setMessages(messages);
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
          {
            running ?
              <Button variant="danger" onClick={stopTest} disabled={readyState !== ReadyState.OPEN}>Stop test</Button>
            :
              <Button variant="primary" onClick={startTest} disabled={readyState !== ReadyState.OPEN}>Start test</Button>
          }
        </Box>
        <Box ml={3}>
          <Box>
            {
              Array.from(messages.values()).sort((a, b) => (a.id < b.id ? -1 : (a.id == b.id ? 0 : 1))).map(message => {
                return <Box key={message.id}>{message.id} {message.text}</Box>
              })
            }
          </Box>
          <Box style={{height: "500px", width: "500px"}}>
            <Chart/>
          </Box>
          <Box>
            {
              messageHistory.reverse().map((value, index) => {
                return <Box key={index}>{value.data}</Box>
              })
            }
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default TesterTab;
