import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { LabIcon } from '@jupyterlab/ui-components';
import { requestAPI } from './handler';
import { JupyterRTCTestWidget } from './widget';
import jupyterRtcTestSvg from '../../style/svg/jupyter-rtc-test.icon.svg';

import './../../style/index.css';

/**
 * The command IDs used by the plugin.
 */
namespace CommandIDs {
  export const create = 'create-jupyter-rtc-test-widget';
}

/**
 * Initialization data for the @datalayer/jupyter-rtc-test extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@datalayer/jupyter-rtc-test:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ISettingRegistry, ILauncher],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    settingRegistry: ISettingRegistry | null,
    launcher: ILauncher
  ) => {
    const { commands } = app;
    const command = CommandIDs.create;
    const jupyterRtcTestIcon = new LabIcon({
      name: 'jupyter-rtc-test:icon',
      svgstr: jupyterRtcTestSvg,
    });
    commands.addCommand(command, {
      caption: 'Show Jupyter RTC Test',
      label: 'Jupyter RTC Test',
      icon: (args: any) => jupyterRtcTestIcon,
      execute: () => {
        const content = new JupyterRTCTestWidget();
        const widget = new MainAreaWidget<JupyterRTCTestWidget>({ content });
        widget.title.label = 'Jupyter RTC Test';
        widget.title.icon = jupyterRtcTestIcon;
        app.shell.add(widget, 'main');
      }
    });
    const category = 'Jupyter RTC Test';
    palette.addItem({ command, category, args: { origin: 'from palette' } });
    if (launcher) {
      launcher.add({
        command,
        category: 'Datalayer',
        rank: 99
      });
    }
    console.log(
      'JupyterLab extension @datalayer/jupyter-rtc-test is activated!'
    );
    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log(
            '@datalayer/jupyter-rtc-test settings loaded:',
            settings.composite
          );
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for @datalayer/jupyter-rtc-test.',
            reason
          );
        });
    }
    requestAPI<any>('get_config')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyter_rtc_test server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
