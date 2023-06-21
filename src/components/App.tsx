import { createRoot } from 'react-dom/client';
import Stresser from './tester/Stresser';

const root = createRoot(document.getElementById('root') as HTMLElement);

const App = () => <>
  <Stresser />
</>

root.render(<App />);
