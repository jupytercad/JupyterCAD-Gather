import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the jupytercad_gather extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad_gather:plugin',
  description: 'A JupyterCAD plugin for the JupyterLab-Gather extenstion',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension jupytercad_gather is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupytercad_gather settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupytercad_gather.', reason);
        });
    }
  }
};

export default plugin;
