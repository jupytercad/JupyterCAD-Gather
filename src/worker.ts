import {
  IDisplayPost,
  IJCadObject,
  IJCadWorker,
  IJupyterCadTracker,
  IPostResult,
  IWorkerMessageBase,
  JCadWorkerSupportedFormat,
  MainAction,
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

  copy(buffer: ArrayBuffer): ArrayBuffer {
    console.log('buffer', buffer);
    const bytes = new Uint8Array(buffer);
    const output = new ArrayBuffer(buffer.byteLength);
    const outputBytes = new Uint8Array(output);
    for (let i = 0; i < bytes.length; i++) {
      outputBytes[i] = bytes[i];
    }
    return output;
  }

  postMessage(msg: IWorkerMessageBase): void {
    console.log('post message', JSON.stringify(msg));

    const ttt = JSON.parse(JSON.stringify(msg));
    console.log('ttt', ttt);
    if (msg.action !== WorkerAction.POSTPROCESS) {
      return;
    }

    if (msg.payload && Object.keys(msg.payload).length > 0) {
      const jCadObject = msg.payload['jcObject'];
      const modelArrayBuffer = msg.payload['postShape'];

      console.log('s2', modelArrayBuffer);

      this._modelRegistry.registerModel({
        name: jCadObject.name,
        gltf: modelArrayBuffer
      });

      const payload: {
        jcObject: IJCadObject;
        postResult: IPostResult;
      }[] = [];

      const handler: (msg: IDisplayPost) => void = this._messageHandlers.get(
        msg.id
      );
      if (handler) {
        handler({ action: MainAction.DISPLAY_POST, payload });
      }
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
