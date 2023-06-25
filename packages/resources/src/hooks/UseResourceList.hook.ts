import { useEffect, useMemo, useState } from 'react';
import { ResourceModel } from '../ResourceModel';
import { ResourceList } from '../ResourceList';
import { Resource } from '../Resource';
import { ResourceListQuery } from '../api';

export function useResourceList<
  T extends ResourceModel,
  ListT extends ResourceList<T> = ResourceList<T>,
  ResourceT extends Resource<T> = Resource<T>,
>(
  resource: ResourceT,
  options?: {
    autoInit?: boolean;
    query?: ResourceListQuery;
    builderOrInstance?: ListT | ((resource: Resource<T>) => ListT);
  },
) {
  const { autoInit = true, query, builderOrInstance } = options ?? {};
  const listInstance = useMemo(() => {
    return typeof builderOrInstance === 'function'
      ? builderOrInstance(resource)
      : builderOrInstance
      ? builderOrInstance
      : (resource.createList(query) as ListT);
  }, [resource]);
  const [list, setList] = useState<ListT>(listInstance);
  useEffect(() => {
    if (listInstance != list) {
      setList(listInstance);
    }
    if (autoInit && !listInstance.isInitialLoaded) {
      listInstance.fetch().then(() => {
        //ignore
      });
    }
  }, [listInstance]);
  return list;
}
