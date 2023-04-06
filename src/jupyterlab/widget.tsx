import { ReactWidget } from '@jupyterlab/apputils';
import MockComponent from '../examples/mock/MockComponent';

export class JupyterRTCTestWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jupyterrtctest-container');
  }

  render(): JSX.Element {
    return <MockComponent />;
  }
}
