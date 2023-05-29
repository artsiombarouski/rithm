import { useState } from 'react';
import { ResourceModel } from '../ResourceModel';
import { ResourceList } from '../ResourceList';

export function useResourceList<
  T extends ResourceModel,
  ListT extends ResourceList<T>,
>(builderOrInstance: ListT | (() => ListT)) {
  const [list] = useState(builderOrInstance);
  return list;
}
