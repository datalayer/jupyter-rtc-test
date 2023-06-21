import { ReactWidget } from '@jupyterlab/apputils';
import Stresser from '../components/stress/Stresser';

export class JupyterRTCTestWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jupyter-rtc-test-container');
  }

  render(): JSX.Element {
    return <Stresser />;
  }

}
