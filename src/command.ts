import { IJupyterCadTracker } from '@jupytercad/schema';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';

import { IModelRegistry } from 'jupyterlab-gather';
import { exportIcon } from './icon';

export namespace CommandIDs {
  export const exportGltf = 'jupytercad:gather:register';
}

export function addCommands(
  app: JupyterFrontEnd,
  tracker: IJupyterCadTracker,
  modelRegistry: IModelRegistry,
  translator: ITranslator
) {
  const trans = translator.load('jupyterlab');
  const { commands } = app;
  commands.addCommand(CommandIDs.exportGltf, {
    label: trans.__('Register GLTF'),
    isEnabled: () => Boolean(tracker.currentWidget),
    icon: exportIcon,
    execute: Private.executeRegisterGltf(modelRegistry, tracker)
  });
}

namespace Private {
  export function executeRegisterGltf(
    modelRegistry: IModelRegistry,
    tracker: IJupyterCadTracker
  ) {
    return async (args: any) => {
      const current = tracker.currentWidget;

      if (!current) {
        return;
      }

      //TODO Updates types
      //@ts-expect-error need to update types
      modelRegistry.registerModel('string');
    };
  }
}
