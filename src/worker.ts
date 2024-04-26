import {
  IJCadWorker,
  IJupyterCadTracker,
  IWorkerMessageBase,
  JCadWorkerSupportedFormat,
  WorkerAction
} from '@jupytercad/schema';
import { PromiseDelegate } from '@lumino/coreutils';
import { IModelRegistry } from 'jupyterlab_gather';
import { v4 as uuid } from 'uuid';

export class GatherWorker implements IJCadWorker {
  constructor(options: GatherWorker.IOptions) {
    this._modelRegistry = options.modelRegistry;
  }

  shapeFormat = JCadWorkerSupportedFormat.GLTF;

  get ready(): Promise<void> {
    return this._ready.promise;
  }

  register(options: {
    messageHandler: ((msg: any) => void) | ((msg: any) => Promise<void>);
    thisArg?: any;
  }): string {
    const { messageHandler, thisArg } = options;
    const id = uuid();
    if (thisArg) {
      messageHandler.bind(thisArg);
    }
    this._messageHandlers.set(id, messageHandler);
    return id;
  }

  unregister(id: string): void {
    this._messageHandlers.delete(id);
  }

  postMessage(msg: IWorkerMessageBase): void {
    if (msg.action !== WorkerAction.POSTPROCESS) {
      return;
    }

    if (msg.payload && Object.keys(msg.payload).length > 0) {
      const jCadObject = msg.payload['jcObject'];
      const modelArrayBuffer = msg.payload['postShape'];

      this._modelRegistry.registerModel({
        name: jCadObject.name.toLowerCase(),
        gltf: modelArrayBuffer
      });
    }
  }

  private _ready = new PromiseDelegate<void>();
  private _messageHandlers = new Map();
  private _modelRegistry: IModelRegistry;
}

export namespace GatherWorker {
  export interface IOptions {
    tracker: IJupyterCadTracker;
    modelRegistry: IModelRegistry;
  }
}
