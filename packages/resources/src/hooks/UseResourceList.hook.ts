import { useEffect, useMemo } from 'react';
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
    permanentQuery?: ResourceListQuery;
    builderOrInstance?:
      | ((resource: Resource<T>, permanentQuery?: ResourceListQuery) => ListT)
      | ListT;
  },
) {
  const {
    autoInit = true,
    permanentQuery,
    builderOrInstance,
    query,
  } = options ?? {};
  const listInstance = useMemo(() => {
    return typeof builderOrInstance === 'function'
      ? builderOrInstance(resource, permanentQuery)
      : builderOrInstance
      ? builderOrInstance
      : (resource.createList(permanentQuery) as ListT);
  }, [resource]);
  useEffect(() => {
    if (listInstance.setQuery(query)) {
      listInstance.fetch().then(() => {
        //ignore
      });
    } else if (autoInit && !listInstance.isInitialLoaded) {
      listInstance.fetch().then(() => {
        //ignore
      });
    }
  }, [listInstance, query]);
  return listInstance;
}
