import { createRoot } from 'react-dom/client';
import Tester from './tester/Tester';

const root = createRoot(document.getElementById('root') as HTMLElement);

const App = () => <>
  <Tester />
</>

root.render(<App />);
