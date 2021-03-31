import { PATH_METADATA } from '@nestjs/common/constants';

type CallbackType<A, R> = (...args: A[]) => R;
type ResetCallbackType = CallbackType<void, void>;
type PatchType<P, A> = P | P[] | CallbackType<A, P | P[]>;

export const patchRoutePathMetadata = <T, P extends string = string, A = void>(
  patchee: T,
  patches: PatchType<P, A>,
  ...args: A[]
): ResetCallbackType => {
  const existingPath = Reflect.getOwnMetadata(PATH_METADATA, patchee);

  if (patches instanceof Function) {
    patches = patches(...args);
  }
  if (!Array.isArray(patches)) {
    patches = [patches];
  }

  const newPath = (existingPath === '/'
    ? [...patches]
    : [...patches, existingPath]
  ).join('/');

  Reflect.defineMetadata(PATH_METADATA, newPath, patchee);

  return createRoutePathResetCallback<T>(existingPath, patchee);
};

export const createRoutePathResetCallback = <T = any>(
  pathValue: string,
  resetTarget: T
) => () => Reflect.defineMetadata(PATH_METADATA, pathValue, resetTarget);

export const getControllerPathPrefix = <T>(controller: T) => {
  return Reflect.getOwnMetadata(PATH_METADATA, controller) || 'filter';
};
