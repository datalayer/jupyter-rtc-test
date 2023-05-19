import { ReactWidget } from '@jupyterlab/apputils';
import Tester from '../components/tester/Tester';

export class JupyterRTCTestWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jupyterrtctest-container');
  }

  render(): JSX.Element {
    return <Tester />;
  }
}
