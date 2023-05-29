import deepmerge from 'deepmerge';
import union from 'lodash/union';
import { isEmpty, isEqual, isNil, isPlainObject, isUndefined } from 'lodash';

const dontMergeArrays = (_oldArray: Array<any>, newArray: Array<any>) =>
  newArray;

/**
 * Merges old attributes with new ones.
 * By default, it doesn't merge arrays.
 */
export const applyPatchChanges = (oldAttributes: {}, changes: {}): {} => {
  return deepmerge(oldAttributes, changes, {
    arrayMerge: dontMergeArrays,
  });
};

export const getChangedAttributesBetween = (
  source: { [key: string]: any },
  target: { [key: string]: any },
): Array<string> => {
  const keys = union(Object.keys(source), Object.keys(target));

  return keys.filter((key) => !isEqual(source[key], target[key]));
};

export const getChangesBetween = (
  source: { [key: string]: any },
  target: { [key: string]: any },
): { [key: string]: any } => {
  const changes: { [key: string]: any } = {};

  getChangedAttributesBetween(source, target).forEach((key) => {
    changes[key] =
      isPlainObject(source[key]) && isPlainObject(target[key])
        ? getChangesBetween(source[key], target[key])
        : target[key];
  });

  return changes;
};

export function isNothing(something: any) {
  if (typeof something === 'number') {
    return something === 0;
  }
  return isEmpty(something) || isUndefined(something) || isNil(something);
}
