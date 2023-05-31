export type CancelState = {
  cancel: () => void;
  isCanceled: boolean;
  isComplete: boolean;
};

export interface CancellablePromise<R = any> extends Promise<R> {
  cancelState: CancelState;
  cancel: () => void;
}

export function createCancellablePromise<R = any>(
  builder: (cancelState: CancelState) => Promise<R>,
): Promise<R> & CancellablePromise<R> {
  const cancelState: CancelState = {
    isCanceled: false,
    isComplete: false,
    cancel: () => {
      cancelState.isCanceled = true;
    },
  };
  const wrappedPromise: Partial<CancellablePromise<R>> = new Promise(
    (resolve, reject) => {
      builder(cancelState)
        .then((...args) => {
          cancelState.isComplete = true;
          return !cancelState.isCanceled && resolve(...args);
        })
        .catch((error) => {
          cancelState.isComplete = true;
          return !cancelState.isCanceled && reject(error);
        });
    },
  );
  wrappedPromise.cancelState = cancelState;
  wrappedPromise.cancel = cancelState.cancel;
  return wrappedPromise as CancellablePromise<R>;
}
