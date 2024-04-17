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
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { IGatherRegistryToken, IModelRegistry } from 'jupyterlab_gather';
import { CommandIDs, addCommands } from './command';
import formSchema from './schema.json';
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
    IGatherRegistryToken
  ],
  optional: [ISettingRegistry, ITranslator],
  activate: (
    app: JupyterFrontEnd,
    workerRegistry: IJCadWorkerRegistry,
    schemaRegistry: IJCadFormSchemaRegistry,
    modelRegistry: IModelRegistry,
    tracker: IJupyterCadTracker,
    externalCommandRegistry: IJCadExternalCommandRegistry,
    settingRegistry: ISettingRegistry | null,
    translator?: ITranslator
  ) => {
    console.log('JupyterLab extension jupytercad:gather is activated!');

    translator = translator ?? nullTranslator;

    const worker = new GatherWorker({ modelRegistry, tracker });
    workerRegistry.registerWorker('jupytercad-gather:worker', worker);
    schemaRegistry.registerSchema('Post::EnableGather', formSchema);

    addCommands(app, tracker, modelRegistry, translator);
    externalCommandRegistry.registerCommand({
      name: 'Register GLTF Model',
      id: CommandIDs.exportGltf
    });
  }
};

export default plugin;
