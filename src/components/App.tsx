import { createRoot } from 'react-dom/client';
import Stresser from './stress/Stresser';

import "./../../style/tooltips.css";

const root = createRoot(document.getElementById('root') as HTMLElement);

const App = () => <>
  <Stresser />
</>

root.render(<App />);
