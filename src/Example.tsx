import { createRoot } from 'react-dom/client';
import MockComponent from './component/MockComponent';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<MockComponent />);
