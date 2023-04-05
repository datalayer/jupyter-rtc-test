import { createRoot } from 'react-dom/client';
import MockComponent from './mock/MockComponent';

const root = createRoot(document.getElementById('root') as HTMLElement);

const Example = () => <>
  <MockComponent />
</>

root.render(<Example />);
