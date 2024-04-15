import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IJCadExternalCommandRegistry,
  IJCadExternalCommandRegistryToken,
  IJCadFormSchemaRegistry,
  IJCadFormSchemaRegistryToken,
  IJCadWorkerRegistry,
  IJCadWorkerRegistryToken,
  IJupyterCadDocTracker,
  IJupyterCadTracker
} from '@jupytercad/schema';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { IArPresentRegistryToken, IModelRegistry } from 'jupyterlab-gather';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { CommandIDs, addCommands } from './command';
import { GatherWorker } from './worker';

/**
 * Initialization data for the jupytercad_gather extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad_gather:plugin',
  description: 'A JupyterCAD plugin for the JupyterLab-Gather extenstion',
  autoStart: true,
  requires: [
    IJCadWorkerRegistryToken,
    IJCadFormSchemaRegistryToken,
    IJupyterCadDocTracker,
    IJCadExternalCommandRegistryToken,
    IArPresentRegistryToken
  ],
  optional: [ISettingRegistry, ITranslator],
  activate: (
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry | null,
    workerRegistry: IJCadWorkerRegistry,
    schemaRegistry: IJCadFormSchemaRegistry,
    modelRegistry: IModelRegistry,
    tracker: IJupyterCadTracker,
    externalCommandRegistry: IJCadExternalCommandRegistry,
    translator?: ITranslator
  ) => {
    console.log('JupyterLab extension jupytercad_gather is activated!');

    translator = translator ?? nullTranslator;

    const worker = new GatherWorker({ modelRegistry, tracker });
    workerRegistry.registerWorker('jupytercad-gatherLworker', worker);

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupytercad_gather settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for jupytercad_gather.',
            reason
          );
        });
    }

    addCommands(app, tracker, modelRegistry, translator);
    externalCommandRegistry.registerCommand({
      name: 'Register GLTF Model',
      id: CommandIDs.exportGltf
    });
  }
};

export default plugin;
