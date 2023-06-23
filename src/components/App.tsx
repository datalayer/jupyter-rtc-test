import { createRoot } from 'react-dom/client';
import Stresser from './stress/Stresser';

require('react-dom');
(window as any).React2 = require('react');
console.log('-------', (window as any).React1 === (window as any).React2);


import "./../../style/tooltips.css";

const root = createRoot(document.getElementById('root') as HTMLElement);

const App = () => <>
  <Stresser />
</>

root.render(<App />);
