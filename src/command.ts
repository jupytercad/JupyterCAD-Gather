import { FormDialog, newName } from '@jupytercad/base';
import {
  IDict,
  IJCadObject,
  IJupyterCadModel,
  IJupyterCadTracker,
  JCadWorkerSupportedFormat
} from '@jupytercad/schema';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { showErrorMessage } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { IModelRegistry } from 'jupyterlab_gather';
import { exportIcon } from './icon';
import formSchema from './schema.json';

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
  const meshOperator = {
    title: 'Register GLTF',
    shape: 'Post::EnableGather',
    default: (model: IJupyterCadModel) => {
      const objects = model.getAllObject();
      const selected = model.localState?.selected?.value || [];
      return {
        Name: newName('GLTF', model),
        //@ts-expect-error wip
        Object: selected.length > 0 ? selected[0] : objects[0].name ?? '',
        Enabled: true
      };
    },
    syncData: (model: IJupyterCadModel) => {
      return (props: IDict) => {
        const { Name, ...parameters } = props;
        const objectModel = {
          shape: 'Post::EnableGather',
          parameters,
          visible: true,
          name: Name,
          shapeMetadata: {
            shapeFormat: JCadWorkerSupportedFormat.GLTF,
            workerId: 'jupytercad-gather:worker'
          }
        };
        const sharedModel = model.sharedModel;
        if (sharedModel) {
          sharedModel.transact(() => {
            if (!sharedModel.objectExists(objectModel.name)) {
              sharedModel.addObject(objectModel as IJCadObject);
            } else {
              showErrorMessage(
                'The object already exists',
                'There is an existing object with the same name.'
              );
            }
          });
        }
      };
    }
  };

  export function executeRegisterGltf(
    modelRegistry: IModelRegistry,
    tracker: IJupyterCadTracker
  ) {
    return async (args: any) => {
      const current = tracker.currentWidget;

      if (!current) {
        return;
      }

      const formJsonSchema = JSON.parse(JSON.stringify(formSchema));
      formJsonSchema['required'] = ['Name', ...formJsonSchema['required']];
      formJsonSchema['properties'] = {
        Name: { type: 'string', description: 'The Name of the Object' },
        ...formJsonSchema['properties']
      };
      const { ...props } = formJsonSchema;
      const dialog = new FormDialog({
        context: current.context,
        title: meshOperator.title,
        sourceData: meshOperator.default(current.context.model),
        schema: props,
        syncData: meshOperator.syncData(current.context.model),
        cancelButton: true
      });
      await dialog.launch();
    };
  }
}
